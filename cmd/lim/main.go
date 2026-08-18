package main

import (
	"context"
	"fmt"
	"lim/db"
	"lim/db/repository"
	"lim/internal/app"
	"lim/internal/config"
	. "lim/internal/crawler"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

func main() {
	log.Printf("starto")
	if err := config.Load("./config.yml"); err != nil {
		log.Fatalf("Configuration error: %v", err)
	}
	Cfg := config.GetConfig()
	ctx := context.Background()
	dbCfg, err := pgxpool.ParseConfig(Cfg.DB.DSN())
	if err != nil {
		log.Fatalf("parse config: %v", err)
	}
	dbCfg.MaxConns = 20
	dbCfg.MaxConns = 20
	dbCfg.MinConns = 5
	pool, err := pgxpool.NewWithConfig(ctx, dbCfg)
	if err != nil {
		log.Fatalf("failed create connection pool: %v", err)
	}
	defer pool.Close()
	if err := db.Migrate(pool); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	rdb := redis.NewClient(&redis.Options{Addr: fmt.Sprintf("%s:%d", Cfg.Redis.Host, Cfg.Redis.Port)})
	repo := repository.New(pool)

	routersInit := app.InitRouter(repo, rdb)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", Cfg.HTTP.Port),
		Handler: routersInit,
	}
	go TorSubHub(ctx, rdb, repo)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("%v", err)
	}
}
