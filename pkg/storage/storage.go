package storage

import (
	"container/list"
	"context"
	_ "embed"
	"fmt"
	"io"
	"log"
	"path/filepath"
	"sync"
	"sync/atomic"

	"github.com/anacrolix/torrent/metainfo"
	"github.com/anacrolix/torrent/storage"
)

// try to diy, make it different from https://github.com/torrplay/torrplay/blob/main/pkg/storage/memory.go. After 1 day it looked like a cheap copy. gud
// make([]any, i) -> i = len = initalized mem != cap(=alocated mem)
// PieceImpl create dynamicly, each time client readat writeat some sort -> can not store data on it -> store else where :O
// copy need len not cap -> initalized mem not alocated

type EmptyStorage struct {
	List    *SafeList
	mu      sync.Mutex
	MaxMem  int64
	size    int64
	dataMap map[string]*PieceData
}
type EmptyPiece struct {
	path    string
	index   int
	length  int64
	storage *EmptyStorage
}
type PieceData struct {
	data      []byte
	listEle   *list.Element
	completed bool
	path      string
}

func NewTorStorage(MaxMem int64) *EmptyStorage {
	safeList := new(SafeList).Init()
	return &EmptyStorage{
		List:    safeList,
		MaxMem:  MaxMem,
		size:    0,
		dataMap: make(map[string]*PieceData),
	}
}
func (s *EmptyStorage) OpenTorrent(ctx context.Context, info *metainfo.Info, infoHash metainfo.Hash) (storage.TorrentImpl, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	torrentDir := filepath.Join(infoHash.HexString())
	return storage.TorrentImpl{
		Piece: func(p metainfo.Piece) storage.PieceImpl {
			return &EmptyPiece{
				index:   p.Index(),
				length:  p.Length(),
				path:    filepath.Join(torrentDir, fmt.Sprintf("%d.piece", p.Index())),
				storage: s,
			}
		},
		Close: func() error { return nil },
	}, nil
}
func (s *EmptyStorage) Size() {
	log.Printf("size: %v", atomic.LoadInt64(&s.size))
	log.Printf("gap: %v", s.MaxMem-atomic.LoadInt64(&s.size))
	log.Printf("map: %v", s.dataMap)
	s.mu.Unlock()
}

func (p *EmptyPiece) ReadAt(b []byte, off int64) (n int, err error) {
	p.storage.mu.Lock()
	defer p.storage.mu.Unlock()
	d, ok := p.storage.dataMap[p.path]
	if !ok || d == nil || d.data == nil {
		log.Printf("this is who fault: ok: %v - d is nil: %v", ok, d == nil)
		return 0, io.EOF
	}
	if p.length < off {
		log.Print("this is who fault: pl<off")
		return 0, io.EOF
	}
	end := off + int64(len(b))
	if end > p.length {
		end = p.length
	}
	n = copy(b, d.data[off:end])
	if n < len(b) {
		log.Print("this is who fault: n<len")
		err = io.EOF
	}
	p.touchPiece(d)
	return n, err
}
func (p *EmptyPiece) WriteAt(b []byte, off int64) (n int, err error) {
	// log.Print("im at writeat")
	if p.length < off {
		return 0, nil
	}
	d := p.getOrCreateData()
	p.storage.mu.Lock()
	defer p.storage.mu.Unlock()
	if d.data == nil {
		log.Print("writeat data == nil")
		return 0, io.ErrShortWrite
	}
	if p.length < int64(len(b))+off {
		err = io.ErrShortWrite
	}
	n = copy(d.data[off:], b)
	p.touchPiece(d)
	return n, err
}
func (p *EmptyPiece) Completion() storage.Completion {
	// log.Print("im at completion")
	p.storage.mu.Lock()
	defer p.storage.mu.Unlock()
	d, ok := p.storage.dataMap[p.path]
	if ok && d.listEle != nil && d != nil && d.data != nil && d.completed {
		return storage.Completion{Complete: true, Ok: true}
	}
	return storage.Completion{Complete: false, Ok: true}
}

func (p *EmptyPiece) getOrCreateData() *PieceData {
	p.storage.mu.Lock()
	defer p.storage.mu.Unlock()
	d, ok := p.storage.dataMap[p.path]
	if !ok || d.data == nil {
		d = &PieceData{
			path: p.path,
		}
		p.TrimPiece(d)
		p.storage.dataMap[p.path] = d
		d.listEle = p.storage.List.PushFront(d)
	}
	return d
}
func (p *EmptyPiece) TrimPiece(d *PieceData) (err error) {
	if d.data == nil {
		d.data = make([]byte, p.length)
		atomic.AddInt64(&p.storage.size, p.length)
	}
	for atomic.LoadInt64(&p.storage.size)+p.length > p.storage.MaxMem {
		elem := p.storage.List.Back()
		if elem == nil {
			break
		}
		pd, ok := elem.Value.(*PieceData)
		if ok {
			if d.data != nil {
				atomic.AddInt64(&p.storage.size, -int64(len(pd.data)))
			}
			pd.data = nil
			delete(p.storage.dataMap, pd.path)
		}

		p.storage.List.Remove(elem)

	}
	return err
}
func (p *EmptyPiece) touchPiece(d *PieceData) {
	if d.listEle == nil {
		d.listEle = p.storage.List.PushFront(d)
	}
	if d.listEle != nil {
		p.storage.List.MoveToFront(d.listEle)
		return
	}
}
func (p *EmptyPiece) MarkComplete() error    { return nil }
func (p *EmptyPiece) MarkNotComplete() error { return nil }
