package crawler

import (
	"bufio"
	"context"
	_ "embed"
	"fmt"
	"lim/db/repository"
	"log"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/anacrolix/torrent/metainfo"
	"github.com/anacrolix/torrent/storage"
	"github.com/jackc/pgx/v5/pgtype"
	PTN "github.com/middelink/go-parse-torrent-name"
	"golang.org/x/time/rate"
)

type Emptystorage struct {
}

func (s Emptystorage) OpenTorrent(ctx context.Context, info *metainfo.Info, infoHash metainfo.Hash) (storage.TorrentImpl, error) {
	var ti storage.TorrentImpl
	return ti, nil
}

// NOTE: handy compile time read file
//
//go:embed tracker.txt
var trackerFileContent string

type task struct {
	Count int
	Hash  string
}

// fake dht crawler
func tor(repo repository.Queries) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	infoHashes, err := repo.GetUnmatchedTorrents(ctx)
	cancel()
	if err != nil || len(infoHashes) == 0 {
		log.Printf("No torrents found: %v)", err)
		return
	}
	trackers := getTracker()

	const numClients = 20
	clients, cleanupClients, err := initTorrentClients(numClients)
	if err != nil {
		log.Printf("Error: %v", err)
		return
	}
	defer cleanupClients()

	insertTasks := make(chan repository.BulkInsertTorrentContentsParams, 100)
	iWg := insertBulkRoutine(repo, insertTasks)

	gotInfotasks := make(chan task, 1000)
	go func() {
		for i, infoHash := range infoHashes {
			gotInfotasks <- task{
				Count: i,
				Hash:  infoHash,
			}
		}
		close(gotInfotasks)
	}()

	var wg sync.WaitGroup
	sem := make(chan struct{}, 1000)
	for t := range gotInfotasks {
		sem <- struct{}{}
		wg.Add(1)
		go func(infoHash string, count int) {
			defer wg.Done()
			defer func() { <-sem }()
			defer func() {
				if r := recover(); r != nil {
					log.Printf("panic: %v", r)
				}
			}()
			client := clients[count%numClients]
			records, err := processTorrent(client, infoHash, trackers, repo)
			if err != nil {
				log.Printf("Error: %v", err)
			}
			for _, rec := range records {
				insertTasks <- rec
			}
		}(t.Hash, t.Count)
	}
	wg.Wait()
	close(insertTasks)
	iWg.Wait()

}
func getTracker() string {
	var sb strings.Builder
	scanner := bufio.NewScanner(strings.NewReader(trackerFileContent))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line != "" {
			sb.WriteString("&tr=")
			sb.WriteString(url.QueryEscape(line))
		}
	}
	return sb.String()
}

func initTorrentClients(numClients int) ([]*torrent.Client, func(), error) {
	clients := make([]*torrent.Client, 0, numClients)
	for i := 0; i < numClients; i++ {
		var s Emptystorage
		cc := torrent.NewDefaultClientConfig()
		cc.TotalHalfOpenConns = 1000
		cc.DialRateLimiter = rate.NewLimiter(1000, 1200)
		cc.HalfOpenConnsPerTorrent = 20
		cc.EstablishedConnsPerTorrent = 20
		cc.NominalDialTimeout = 5 * time.Second
		cc.MinDialTimeout = 2 * time.Second
		cc.NoDefaultPortForwarding = true
		cc.ListenPort = 0
		cc.DefaultStorage = s
		c, err := torrent.NewClient(cc)
		if err != nil {
			return nil, nil, err
		}
		clients = append(clients, c)
	}
	cleanup := func() {
		for _, c := range clients {
			c.Close()
		}
	}

	return clients, cleanup, nil

}

func insertBulkRoutine(repo repository.Queries, insertTasks chan repository.BulkInsertTorrentContentsParams) *sync.WaitGroup {
	var insertWg sync.WaitGroup
	insertWg.Add(1)

	go func() {
		defer insertWg.Done()
		var batch []repository.BulkInsertTorrentContentsParams
		flush := func() {
			if len(batch) == 0 {
				return
			}
			ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
			defer cancel()
			_, err := repo.BulkInsertTorrentContents(ctx, batch)
			if err != nil {
				log.Printf("Error: %v", err)
			}
			batch = batch[:0]
		}

		for task := range insertTasks {
			batch = append(batch, task)
			if len(batch) >= 300 {
				flush()
			}
		}
		flush()
	}()
	return &insertWg
}

func processTorrent(client *torrent.Client, infoHash string, trackers string, repo repository.Queries) ([]repository.BulkInsertTorrentContentsParams, error) {
	magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", infoHash, trackers)
	t, err := client.AddMagnet(magnetLink)
	if err != nil {
		log.Printf("%v", err)
		return nil, err
	}
	defer t.Drop()
	select {
	case <-t.GotInfo():
		fmt.Println("found!")
	case <-time.After(300 * time.Second):
		log.Println("timeout")
		return nil, nil
	}
	info := t.Info()
	var records []repository.BulkInsertTorrentContentsParams
	for _, file := range info.UpvertedFiles() {
		path := file.DisplayPath(info)
		parsedName, err := PTN.Parse(path)
		if err != nil {
			continue
		}
		ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
		movieID, err := repo.SearchMoviesByTitleAndYear(ctx, repository.SearchMoviesByTitleAndYearParams{
			Title:       parsedName.Title,
			ReleaseYear: strconv.Itoa(parsedName.Year),
		})
		cancel()
		var matchID pgtype.Int4
		if err == nil {
			matchID = pgtype.Int4{
				Int32: movieID,
				Valid: true,
			}
		}
		records = append(records, repository.BulkInsertTorrentContentsParams{
			Infohash:    infoHash,
			TorrentName: strings.ToValidUTF8(info.Name, ""),
			ContentName: strings.ToValidUTF8(path, ""),
			SizeBytes:   file.Length,
			MatchID:     matchID,
		})
	}
	return records, nil
}
