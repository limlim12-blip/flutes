package models

import (
	"lim/internal/db/repository"
)

type TorInfo struct {
	Count   int                                `json:"count"`
	Torrent repository.GetUnmatchedTorrentsRow `json:"torrent"`
}
type Route[T any] struct {
	Name string
}

type Controler string

const (
	Start Controler = "start"
	Stop  Controler = "stop"
)

var (
	CrawlerControl        = Route[Controler]{Name: "crawler:control"}
	CrawlerGetInfo        = Route[TorInfo]{Name: "crawler:get_info"}
	CrawlerTorrentContent = Route[repository.BulkInsertTorrentContentsParams]{Name: "db:torrent_content:bulk_insert"}
)
