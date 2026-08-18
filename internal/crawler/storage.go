package crawler

import (
	"context"
	_ "embed"
	"io"

	"github.com/anacrolix/torrent/metainfo"
	"github.com/anacrolix/torrent/storage"
)

type EmptyStorage struct{}
type EmptyPiece struct{}

func (s EmptyPiece) ReadAt(p []byte, off int64) (n int, err error)  { return 0, io.EOF }
func (s EmptyPiece) WriteAt(p []byte, off int64) (n int, err error) { return len(p), nil }
func (s EmptyPiece) MarkComplete() error                            { return nil }
func (s EmptyPiece) MarkNotComplete() error                         { return nil }
func (s EmptyPiece) Completion() storage.Completion {
	return storage.Completion{Err: nil, Ok: false, Complete: true}
}

func (s EmptyStorage) OpenTorrent(ctx context.Context, info *metainfo.Info, infoHash metainfo.Hash) (storage.TorrentImpl, error) {
	return storage.TorrentImpl{
		Piece: func(p metainfo.Piece) storage.PieceImpl {
			return EmptyPiece{}
		},
		Close: func() error {
			return nil
		},
	}, nil
}
