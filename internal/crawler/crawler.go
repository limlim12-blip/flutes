package crawler

import (
	"bufio"
	"context"
	_ "embed"
	"fmt"
	"lim/db/repository"
	"lim/internal/config"
	"log"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/jackc/pgx/v5/pgtype"
	PTN "github.com/middelink/go-parse-torrent-name"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"
)

// NOTE: handy compile time read file
//
//go:embed tracker.txt
var trackerFileContent string

type task struct {
	Count   int
	torrent repository.GetUnmatchedTorrentsRow
}

func TorSubHub(ctx context.Context, rdb *redis.Client, repo *repository.Queries) {
	var mu sync.Mutex
	var ctxCancel context.CancelFunc
	pubsub := rdb.Subscribe(ctx, config.ChannelCrawlerControl)
	defer pubsub.Close()
	_, err := pubsub.Receive(ctx)
	if err != nil {
		log.Fatalf("failed to subscribe: %v", err)
	}
	ch := pubsub.Channel()
	for msg := range ch {
		switch msg.Payload {
		case "start":
			if ctxCancel != nil {
				log.Println("crawler already running")
				return
			}
			crawlCtx, cancel := context.WithCancel(ctx)
			ctxCancel = cancel
			go func() {
				defer func() {
					mu.Lock()
					ctxCancel = nil
					mu.Unlock()
				}()
				log.Println("starting crawler...")
				tor(crawlCtx, repo)
				log.Println("crawler finished")
			}()
		case "stop":
			mu.Lock()
			defer mu.Unlock()
			if ctxCancel != nil {
				log.Println("stopping crawler...")
				ctxCancel()
				ctxCancel = nil
			} else {
				log.Println("0 active crawler to stop")
			}
		default:
			log.Printf("unknown command received: %s", msg.Payload)
		}

	}

}

var Trackers string

// fake dht crawler
func tor(ctx context.Context, repo *repository.Queries) {
	Trackers = getTracker()
	queryCtx, cancel := context.WithTimeout(ctx, 2*time.Minute)
	infoHashes, err := repo.GetUnmatchedTorrents(queryCtx)
	cancel()
	if err != nil || len(infoHashes) == 0 {
		log.Printf("No torrents found: %v)", err)
		return
	}

	const numClients = 3
	clients, cleanupClients, err := initTorrentClients(numClients)
	if err != nil {
		log.Printf("Error: %v", err)
		return
	}
	defer cleanupClients()

	insertTasks := make(chan repository.BulkInsertTorrentContentsParams, 1000)
	iWg := insertBulkRoutine(ctx, repo, insertTasks)

	gotInfoTasks := make(chan task, 1000)
	go func() {
		skip := 3000
		for i, infoHash := range infoHashes {
			if skip > 0 {
				skip--
				continue
			}
			select {
			case <-ctx.Done():
				return
			case gotInfoTasks <- task{Count: i, torrent: infoHash}:
			}
		}
		close(gotInfoTasks)
	}()

	var wg sync.WaitGroup
	taskLimiter := rate.NewLimiter(rate.Limit(40), 60)
	const numWorkers = 300
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			defer func() {
				if r := recover(); r != nil {
					log.Printf("panic: %v", r)
				}
			}()
			for t := range gotInfoTasks {
				if ctx.Err() != nil {
					return
				}
				client := clients[t.Count%numClients]
				records, err := processTorrent(ctx, client, t, taskLimiter, repo)
				if err != nil {
					log.Printf("Error: %v", err)
				}
				for _, rec := range records {
					select {
					case <-ctx.Done():
						return
					case insertTasks <- rec:
					}
				}
			}
		}()
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
	basePort := config.GetConfig().TorrentConf.ListenPort
	data, err := os.ReadFile("/tmp/gluetun/forwarded_port")
	if err != nil {
		log.Printf("failed read port %v", err)
	} else {
		portStr := strings.TrimSpace(string(data))
		if p, err := strconv.Atoi(portStr); err == nil && p > 0 {
			basePort = p
		}
	}

	for i := 0; i < numClients; i++ {
		var s EmptyStorage
		cc := torrent.NewDefaultClientConfig()
		cc.DefaultStorage = s
		cc.TotalHalfOpenConns = 200
		cc.DialRateLimiter = rate.NewLimiter(400, 600)
		cc.HalfOpenConnsPerTorrent = 10
		cc.EstablishedConnsPerTorrent = 10
		cc.NominalDialTimeout = 15 * time.Second
		cc.MinDialTimeout = 5 * time.Second
		cc.NoUpload = true
		cc.DisableUTP = true
		cc.DisableTCP = false
		cc.ListenPort = basePort + i
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

func insertBulkRoutine(ctx context.Context, repo *repository.Queries, insertTasks chan repository.BulkInsertTorrentContentsParams) *sync.WaitGroup {
	var insertWg sync.WaitGroup
	insertWg.Add(1)
	var count int32
	go func() {
		defer insertWg.Done()
		var batch []repository.BulkInsertTorrentContentsParams
		flush := func() {
			if len(batch) == 0 {
				return
			}
			queryCtx, cancel := context.WithTimeout(ctx, 1*time.Minute)
			defer cancel()
			_, err := repo.BulkInsertTorrentContents(queryCtx, batch)
			if err != nil {
				log.Printf("Error: %v", err)
			}
			batch = batch[:0]
		}
		ticker := time.NewTicker(3 * time.Minute)
		maxBatchSize := 300
		defer ticker.Stop()
		for task := range insertTasks {
			select {
			case <-ctx.Done():
				break
			case <-ticker.C:
				flush()
			default:
				atomic.AddInt32(&count, 1)
				log.Printf("added %d", atomic.LoadInt32(&count))
				batch = append(batch, task)
				if len(batch) >= maxBatchSize {
					flush()
				}
			}
		}
		flush()
	}()
	return &insertWg
}

func processTorrent(ctx context.Context, client *torrent.Client, task task, taskLimiter *rate.Limiter, repo *repository.Queries) ([]repository.BulkInsertTorrentContentsParams, error) {
	if isBlocked(task.torrent.Name) {
		log.Printf("- blocked %d", task.Count)
		return nil, nil
	}
	magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", task.torrent.Infohash, Trackers)
	log.Printf("- passed %d", task.Count)
	taskLimiter.Wait(ctx)
	t, err := client.AddMagnet(magnetLink)

	if err != nil {
		log.Printf("%v", err)
		return nil, err
	}
	defer t.Drop()
	select {
	case <-t.GotInfo():
		log.Printf("found!: %s - %s \n", t.InfoHash(), t.Name())
		break
	case <-time.After(300 * time.Second):
		log.Printf("timeout %d", task.Count)
		return nil, nil
	}
	info := t.Info()
	for _, file := range info.UpvertedFiles() {
		path := file.DisplayPath(info)
		if hasBannedExtension(path) {
			return nil, nil
		}
	}

	var records []repository.BulkInsertTorrentContentsParams
	for _, file := range info.UpvertedFiles() {
		path := file.DisplayPath(info)
		parsedName, err := PTN.Parse(path)
		if err != nil {
			continue
		}
		queryCtx, cancel := context.WithTimeout(ctx, 10*time.Minute)
		movieID, err := repo.SearchMoviesByTitleAndYear(queryCtx, repository.SearchMoviesByTitleAndYearParams{
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
			Infohash:          task.torrent.Infohash,
			TorrentName:       info.Name,
			ContentName:       path,
			SizeBytes:         file.Length,
			MatchID:           matchID,
			ParsedContentName: parsedName.Title,
		})
	}
	return records, nil
}
