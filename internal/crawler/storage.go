package crawler

import (
	"container/list"
	"context"
	_ "embed"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"

	"github.com/anacrolix/torrent/metainfo"
	"github.com/anacrolix/torrent/storage"
)

type EmptyStorage struct {
	BaseDir string
	List    *SafeList
	mu      sync.Mutex
	MaxMem  int64
	size    int64
}
type EmptyPiece struct {
	path    string
	index   int
	length  int64
	listEle *list.Element
	mu      sync.Mutex
	storage *EmptyStorage
}

func (p *EmptyPiece) ReadAt(b []byte, off int64) (int, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	f, err := os.Open(p.path)
	if err != nil {
		return 0, nil
	}
	if off < 0 || off >= p.length {
		return 0, io.EOF
	}

	remaining := p.length - off
	if int64(len(b)) > remaining {
		b = b[:remaining]
		return 0, io.EOF
	}

	defer f.Close()

	n, err := f.ReadAt(b, off)
	if err == nil {
		p.touchPiece()
	}
	return n, err

}
func (p *EmptyPiece) WriteAt(b []byte, off int64) (n int, err error) {
	// log.Print("im at writeat")
	p.mu.Lock()
	defer p.mu.Unlock()
	f, err := os.OpenFile(p.path, os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return 0, err
	}
	defer f.Close()
	n, err = f.WriteAt(b, off)
	if err == nil {
		p.touchPiece()
	}
	p.TrimPiece(int64(len(b)))
	return n, err
}
func (p *EmptyPiece) MarkComplete() error    { return nil }
func (p *EmptyPiece) MarkNotComplete() error { return nil }
func (p *EmptyPiece) Completion() storage.Completion {
	// log.Print("im at completion")
	p.mu.Lock()
	defer p.mu.Unlock()

	stat, err := os.Stat(p.path)
	if err != nil {
		return storage.Completion{Complete: false, Ok: true}
	}
	if stat.Size() >= p.length {
		return storage.Completion{Complete: true, Ok: true}
	}

	return storage.Completion{Complete: false, Ok: true}
}

func (s *EmptyStorage) OpenTorrent(ctx context.Context, info *metainfo.Info, infoHash metainfo.Hash) (storage.TorrentImpl, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	torrentDir := filepath.Join(s.BaseDir, infoHash.HexString())
	os.MkdirAll(torrentDir, 0755)
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
func (p *EmptyPiece) touchPiece() {
	if p.listEle == nil {
		p.listEle = p.storage.List.PushFront(p)
	}
	if p.listEle != nil {
		p.storage.List.MoveToFront(p.listEle)
		return
	}
}
func (s *EmptyStorage) Size() int64 {
	return atomic.LoadInt64(&s.size)
}
func (p *EmptyPiece) TrimPiece(size int64) {
	log.Printf("%v-%v", p.length)
	if atomic.LoadInt64(&p.storage.size)+size >= p.storage.MaxMem {
		elem := p.storage.List.Back()
		if elem != nil {
			pd, ok := elem.Value.(*EmptyPiece)
			if ok {
				os.Remove(pd.path)
				p.storage.List.Remove(elem)
			}
		}
	}
}

func (s *EmptyStorage) New(BaseDir string, List *SafeList, MaxMem int64) EmptyStorage {
	return EmptyStorage{
		BaseDir: BaseDir,
		List:    List,
		MaxMem:  MaxMem,
		size:    0,
	}
}

type SafeList struct {
	list *list.List
	mu   sync.Mutex
}

func (s *SafeList) Init() *SafeList {
	s.mu.Lock()
	defer s.mu.Unlock()
	return &SafeList{list: list.New().Init()}
}
func (s *SafeList) Remove(e *list.Element) any {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.Remove(e)
}
func (s *SafeList) PushFront(v any) *list.Element {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.PushFront(v)
}
func (s *SafeList) MoveToFront(e *list.Element) *list.Element {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.Back()
}
func (s *SafeList) Back() *list.Element {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.Back()
}
