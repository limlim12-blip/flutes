package main

import (
	"compress/gzip"
	"lim/internal/config"

	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"lim/db/repository"
	"lim/internal/config"
	"lim/internal/models"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/time/rate"
)

type movie struct {
	ID            int     `json:"id"`
	Adult         bool    `json:"adult"`
	OriginalTitle string  `json:"original_title"`
	Popularity    float64 `json:"popularity"`
	Video         bool    `json:"video"`
}

type tv struct {
	ID           int    `json:"id"`
	Adult        bool   `json:"adult"`
	OriginalName string `json:"original_name"`
}

type item interface {
	GetID() int
	GetType() string
}

func (m movie) GetID() int      { return m.ID }
func (t tv) GetID() int         { return t.ID }
func (m movie) GetType() string { return "movie" }
func (t tv) GetType() string    { return "tv" }

func main() {
	if err := config.Load("./config.yml"); err != nil {
		log.Fatalf("Configuration error: %v", err)
	}
	path := "/home/lim/data/Projects/golang/stuff/tv_series_ids_08_29_2026.json.gz"
	crawlData[tv](path)
}

func crawlData[T item](path string) {
	log.Print("start")
	Cfg := config.GetConfig()
	ctx := context.Background()

	dbCfg, err := pgxpool.ParseConfig(strings.ReplaceAll(Cfg.DB.DSN(), "db", "localhost"))
	if err != nil {
		log.Fatalf("parse config: %v", err)
	}
	dbCfg.MaxConns = 20
	dbCfg.MinConns = 5

	pool, err := pgxpool.NewWithConfig(ctx, dbCfg)
	if err != nil {
		log.Fatalf("failed create connection pool: %v", err)
	}
	defer pool.Close()

	repo := repository.New(pool)
	log.Print("repo")

	f, err := os.Open(path)
	if err != nil {
		log.Fatalf("%v", err)
	}
	defer f.Close()

	gz, err := gzip.NewReader(f)
	if err != nil {
		log.Fatalf("%v", err)
	}
	defer gz.Close()

	decoder := json.NewDecoder(gz)
	ch := make(chan T, 1000)

	go func() {
		defer close(ch)
		for {
			var content T
			if err := decoder.Decode(&content); err != nil {
				if errors.Is(err, io.EOF) {
					break
				}
				log.Printf("decoding error: %v", err)
				break
			}
			ch <- content
		}
	}()

	taskLimiter := rate.NewLimiter(rate.Limit(60), 80)
	const numworker = 20
	var wg sync.WaitGroup
	var count int32 = 1
	for i := 0; i < numworker; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for content := range ch {
				url := fmt.Sprintf("https://api.themoviedb.org/3/%s/%d?language=en-US", content.GetType(), content.GetID())
				req, err := http.NewRequest("GET", url, nil)
				if err != nil {
					log.Printf("request creation error: %v", err)
					continue
				}
				req.Header.Add("accept", "application/json")
				req.Header.Add("Authorization", fmt.Sprintf("Bearer ", config.GetConfig().APIkey.TmDB))

				if err := taskLimiter.Wait(ctx); err != nil {
					log.Printf("limiter error: %v", err)
					return
				}

				res, err := http.DefaultClient.Do(req)
				if err != nil {
					log.Printf("http do error: %v", err)
					time.Sleep(time.Second)
					continue
				}

				func() {
					defer res.Body.Close()

					if res.StatusCode == 404 {
						log.Printf("not found")
						return
					}
					if res.StatusCode != 200 {
						log.Printf("unexpected status code: %d", res.StatusCode)
						return
					}

					body, err := io.ReadAll(res.Body)
					if err != nil {
						log.Printf("read body error: %v", err)
						return
					}

					var a models.MediaItem
					if err := json.Unmarshal(body, &a); err != nil {
						log.Printf("json unmarshal error: %v", err)
						return
					}

					b := repository.InsertTMDBParams{
						ID:               int32(a.ID),
						Title:            a.GetName(),
						VoteAverage:      a.VoteAverage,
						VoteCount:        int(a.VoteCount),
						ReleaseDate:      a.GetDate(),
						OriginalLanguage: &a.OriginalLanguage,
						OriginalTitle:    a.GetOriName(),
						Popularity:       a.Popularity,
					}
					if err := repo.InsertTMDB(ctx, b); err != nil {
						log.Printf("db insert error: %v", err)
					}
					log.Printf("%d", atomic.LoadInt32(&count))
					atomic.AddInt32(&count, 1)
				}()
			}
		}()
	}

	wg.Wait()
	log.Print("crawl completed successfully")
}
