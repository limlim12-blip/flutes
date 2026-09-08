package worker

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"lim/internal/config"
	"lim/internal/db/repository"
	"lim/internal/models"
	. "lim/internal/models"
	. "lim/pkg/broker"
	. "lim/pkg/logger"
	. "lim/pkg/storage"
	. "lim/pkg/utils"
	"os"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/anacrolix/torrent/metainfo"
	PTN "github.com/middelink/go-parse-torrent-name"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"
)

type TorHub struct {
	*Woke
	Clients     []*torrent.Client
	taskLimiter *rate.Limiter
	cache       map[string]repository.SearchMoviesByTitleAndYearRow
	repo        *repository.Queries
	numClient   int
	maxMem      int64
	insertChan  chan repository.BulkInsertTorrentContentsParams
}

func InitTorHub(ctx context.Context, rdb *redis.Client, repo *repository.Queries, brokerChan *Broker) (*TorHub, error) {
	ctxWoke, cancel := context.WithCancel(ctx)
	if err := brokerChan.NewQueue[models.TorInfo](-1, models.CrawlerGetInfo); err != nil {
		//TODO
		Sugar.Debugw("new queue error", "error", err)
	}
	if err := brokerChan.NewQueue[repository.BulkInsertTorrentContentsParams](-1, models.CrawlerTorrentContent); err != nil {
		//TODO
		Sugar.Debugw("new queue error", "error", err)
	}
	if err := brokerChan.NewQueue[models.Controler](-1, models.CrawlerControl); err != nil {
		//TODO
		Sugar.Debugw("new queue error", "error", err)
	}
	var woke = &Woke{
		name:            "crawler",
		ctx:             ctxWoke,
		cancelFn:        cancel,
		rdb:             rdb,
		broker:          brokerChan,
		controllerRoute: models.CrawlerControl,
	}
	var t = TorHub{
		repo:        repo,
		taskLimiter: rate.NewLimiter(rate.Limit(100), 140),
		Woke:        woke,
		numClient:   config.GetConfig().TorrentConf.NumClient,
		maxMem:      config.GetConfig().TorrentConf.MaxMemCrawler,
		insertChan:  make(chan repository.BulkInsertTorrentContentsParams),
		cache:       make(map[string]repository.SearchMoviesByTitleAndYearRow),
	}

	t.protest = t.process
	// basePort := getBasePort()
	basePort := 0
	for i := 0; i < t.numClient; i++ {
		cc := torrent.NewDefaultClientConfig()
		cc.TotalHalfOpenConns = 200
		cc.DialRateLimiter = rate.NewLimiter(400, 600)
		cc.HalfOpenConnsPerTorrent = 10
		cc.EstablishedConnsPerTorrent = 10
		cc.NominalDialTimeout = 15 * time.Second
		cc.MinDialTimeout = 5 * time.Second
		cc.NoUpload = true
		cc.DisableUTP = false
		cc.DisableTCP = false
		if i == 0 {
			cc.ListenPort = basePort
		} else {
			cc.ListenPort = 0
		}
		cc.DefaultStorage = NewTorStorage(int64(t.maxMem))
		c, err := torrent.NewClient(cc)
		if err != nil {
			return &t, fmt.Errorf("failed to initialize torrent client number %d/%d: %w", i, err, t.numClient)
		}
		t.Clients = append(t.Clients, c)
	}
	Sugar.Infow("crawler torrent client initialized successfully", "max_memory", t.maxMem, "num_client", t.numClient)
	return &t, nil
	// if err != nil {
	// 	Sugar.Errorw("failed to init torrent hub", "error", err)
	// 	return
	// }
}
func (t *TorHub) cleanupClients() (errs []error) {
	t.mu.Lock()
	Sugar.Debug("closing tor woker clients")
	for _, c := range t.Clients {
		errs = append(errs, c.Close()...)
	}
	t.mu.Unlock()
	return errs
}

// fake dht crawler
func (t *TorHub) process() error {
	// defer t.cleanupClients()
	if len(t.Clients) < 1 {
		return errors.New("0 tor client running")
	}
	go func() {
		if err := t.insertBulk(t.insertChan); err != nil && !errors.Is(err, context.Canceled) {
			Sugar.Errorw("insertBulk woker crashed", "error", err)
		}
		Sugar.Debug("insertBulk woker stopped cleanly")
	}()
	go func() {
		if err := t.crawler(); err != nil && !errors.Is(err, context.Canceled) {
			Sugar.Errorw("crawler woker crashed", "error", err)
		}
		Sugar.Debug("crawler woker stopped cleanly")

	}()
	go func() {
		err := t.broker.Consume(t.ctx, CrawlerTorrentContent, func(ctx context.Context, param repository.BulkInsertTorrentContentsParams) error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case t.insertChan <- param:
				return nil
			}
		})
		if err != nil && !errors.Is(err, context.Canceled) {
			Sugar.Errorw("torrent content consumer crashed", "error", err, "queue", CrawlerTorrentContent.Name)
		}
		close(t.insertChan)
		Sugar.Debug("torrent content consumer stopped cleanly")
	}()
	var wg sync.WaitGroup
	const numWorkers = 300
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			err := t.broker.Consume(t.ctx, CrawlerGetInfo, t.processTorrent)
			if err != nil && !errors.Is(err, context.Canceled) {
				Sugar.Errorw("getinfo consumer crashed", "error", err, "queue", CrawlerGetInfo.Name)
			}
			Sugar.Debugw("getinfo consumer stopped cleanly")
		}()
	}
	wg.Wait()
	return nil
}

func getBasePort() (port int) {
	data, err := os.ReadFile("/tmp/gluetun/forwarded_port")
	if err != nil {
		Sugar.Warnw("failed to read forwarded port, using default",
			"error", err,
			"default_port", port,
		)
	} else {
		portStr := strings.TrimSpace(string(data))
		if p, err := strconv.Atoi(portStr); err == nil && p > 0 {
			port = p
		}
	}
	return port
}

func (t *TorHub) insertBulk(ch <-chan repository.BulkInsertTorrentContentsParams) error {
	var count int32
	var batch []repository.BulkInsertTorrentContentsParams
	maxBatchSize := 400
	ticker := time.NewTicker(5 * time.Minute)
	flush := func() {
		if len(batch) == 0 {
			return
		}
		queryCtx, cancel := context.WithTimeout(t.ctx, 1*time.Minute)
		_, err := t.repo.BulkInsertTorrentContents(queryCtx, batch)
		cancel()
		if err != nil && !errors.Is(err, context.Canceled) {
			Sugar.Errorw("batch insert failed", "error", err, "batch_size", len(batch))
		} else {
			Sugar.Infow(
				"flushed torrent batch to database",
				"batch_size", len(batch),
				"total_inserted", atomic.LoadInt32(&count))
		}
		batch = batch[:0]
	}
	for {
		select {
		case <-t.ctx.Done():
			return t.ctx.Err()
		case <-ticker.C:
			flush()
		case t, ok := <-ch:
			if !ok {
				flush()
				return nil
			}
			atomic.AddInt32(&count, 1)
			batch = append(batch, t)
			if len(batch) >= maxBatchSize {
				flush()
			}
		}
	}
}

var Trackers string = GetTracker()

func (t *TorHub) processTorrent(ctx context.Context, Task TorInfo) error {
	defer func() {
		if r := recover(); r != nil {
			Sugar.Errorw("panic recovered in processTorrent",
				"panic", r,
				"infohash", Task.Torrent.Infohash,
			)
		}
	}()
	if t.ctx.Err() != nil {
		return t.ctx.Err()
	}
	if IsBlocked(Task.Torrent.Name) {
		Sugar.Warnw("skipping torrent: name contains offensive words",
			"infohash", Task.Torrent.Infohash,
			"torrent_name", Task.Torrent.Name,
		)
		return nil
	}
	magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", Task.Torrent.Infohash, Trackers)
	Sugar.Debugw("adding magnet to client", "infohash", Task.Torrent.Infohash, "task_count", Task.Count)
	if err := t.taskLimiter.Wait(t.ctx); err != nil {
		return err
	}
	t.mu.RLock()
	tor, err := t.Clients[Task.Count%len(t.Clients)].AddMagnet(magnetLink)
	t.mu.RUnlock()
	if err != nil {
		return fmt.Errorf("failed to add magnet: %w", err)
	}
	defer tor.Drop()
	select {
	case <-tor.GotInfo():
		Sugar.Infow("torrent metadata found!",
			"infohash", Task.Torrent.Infohash,
			"name", tor.Name(),
		)
	case <-t.ctx.Done():
		return t.ctx.Err()
	case <-time.After(40 * time.Second):
		//TODO: this should be error when crawl from dht but read from db -> let it in db
		Sugar.Infow("torrent timeout",
			"infohash", Task.Torrent.Infohash,
			"task_count", Task.Count,
		)
	}
	var files []metainfo.FileInfo
	if tor.Info() != nil {
		files = tor.Info().UpvertedFiles()
	}
	records, err := t.processInfo(Task.Torrent.Infohash, Task.Torrent.Name, files, &t.cache)
	if err != nil {
		return err
	}
	for _, rec := range records {
		if ctx.Err() != nil {
			return err
		}
		if err := t.broker.Publish(ctx, CrawlerTorrentContent, rec); err != nil {
			return fmt.Errorf("failed to publish %s: %w", rec.ContentName, err)
		}
	}
	return err
}

func (t *TorHub) processInfo(infohash string, tor_name string, files []metainfo.FileInfo, movIds *map[string]repository.SearchMoviesByTitleAndYearRow) ([]repository.BulkInsertTorrentContentsParams, error) {
	if t.ctx.Err() != nil {
		return nil, t.ctx.Err()
	}
	var records []repository.BulkInsertTorrentContentsParams
	if files == nil {
		records = append(records, repository.BulkInsertTorrentContentsParams{
			Infohash:    infohash,
			TorrentName: "timeout",
			ContentName: "timeout",
			SizeBytes:   0,
		})

		return records, nil
	}
	for _, file := range files {
		var path string
		if strings.Join(file.BestPath(), "/") != "" {
			path = strings.Join(file.BestPath(), "/")
		} else {
			path = tor_name
		}
		if HasBannedExtension(path) {
			Sugar.Warnw("skipping torrent file: banned extension", "infohash", infohash, "file_path", path)
			records = append(records, repository.BulkInsertTorrentContentsParams{
				Infohash:    infohash,
				TorrentName: strings.ToValidUTF8(tor_name, ""),
				ContentName: strings.ToValidUTF8("banned", ""),
				SizeBytes:   file.Length,
			})

			return records, nil
		}
	}
	for _, file := range files {
		var path string
		if strings.Join(file.BestPath(), "/") != "" {
			path = strings.Join(file.BestPath(), "/")
		} else {
			path = tor_name
		}
		findMatch := func(ctx context.Context, path string) (movie repository.SearchMoviesByTitleAndYearRow, parsedName *PTN.TorrentInfo, err error) {
			parsedName, err = PTN.Parse(path)
			if err != nil {
				Sugar.Debugw("failed to parse torrent name",
					"name", path,
					"error", err,
				)
				return
			}
			key := parsedName.Title + strconv.Itoa(parsedName.Year)
			t.mu.RLock()
			match, ok := (*movIds)[key]
			t.mu.RUnlock()
			if ok {
				return match, parsedName, nil
			}
			if ctx.Err() != nil {
				return match, nil, ctx.Err()
			}
			movie, err = t.repo.SearchMoviesByTitleAndYear(ctx, repository.SearchMoviesByTitleAndYearParams{
				Title:       strings.ToValidUTF8(parsedName.Title, ""),
				ReleaseYear: strconv.Itoa(parsedName.Year),
			})
			if err != nil {
				return movie, parsedName, err
			}
			t.mu.Lock()
			(*movIds)[key] = movie
			t.mu.Unlock()
			return movie, parsedName, nil
		}
		ctx, cancel := context.WithTimeout(t.ctx, 30*time.Minute)
		var match repository.SearchMoviesByTitleAndYearRow
		match, parsedName, err := findMatch(ctx, path)
		if err != nil {
			Sugar.Debugw("movie match not found in database using file path",
				"parsed_content_path", parsedName.Title,
				"content_path", path,
				"error", err,
			)

			match, parsedName, err = findMatch(ctx, tor_name)
			if err != nil {
				Sugar.Debugw("movie match not found in database using torrent name",
					"parsed_torrent_name", parsedName.Title,
					"torrent_name", tor_name,
					"error", err,
				)
			}
		}
		cancel()
		var typePtr *string
		if match.Type != "" {
			typePtr = &match.Type
		} else {
			typePtr = nil
		}
		records = append(records, repository.BulkInsertTorrentContentsParams{
			Infohash:          infohash,
			TorrentName:       strings.ToValidUTF8(tor_name, ""),
			ContentName:       strings.ToValidUTF8(path, ""),
			SizeBytes:         file.Length,
			MatchID:           Ptr(int32(match.ID)),
			ParsedContentName: Ptr(strings.ToValidUTF8(parsedName.Title, "")),
			Season:            Ptr(int32(parsedName.Season)),
			Episode:           Ptr(int32(parsedName.Episode)),
			Resolution:        Ptr(parsedName.Resolution),
			Codec:             Ptr(parsedName.Codec),
			Quality:           Ptr(parsedName.Quality),
			Type:              typePtr,
		})
	}
	if records == nil {

		Sugar.Infow("movie match not found in database",
			"torrent_name", tor_name,
			"infohash", infohash,
		)
	}
	return records, nil
}
func (t *TorHub) crawler() error {
	queryCtx, cancel := context.WithTimeout(t.ctx, 2*time.Minute)
	infoHashes, err := t.repo.GetUnmatchedTorrents(queryCtx)
	cancel()
	if err != nil || len(infoHashes) == 0 {
		return fmt.Errorf("no torrents found: %w)", err)
	}
	Sugar.Infow(
		"fetched unmatched torrents from database",
		"count", len(infoHashes),
	)
	skip := 1
	for i, infoHash := range infoHashes {
		if skip > 0 {
			skip--
			continue
		}
		if t.ctx.Err() != nil {
			return t.ctx.Err()
		}
		err := t.broker.Publish(t.ctx, CrawlerGetInfo, TorInfo{Count: i, Torrent: infoHash})
		if err != nil {
			Sugar.Errorw("failed to publish infoHash", "infohash", infoHash, "error", err)
		}
	}
	return nil
}
