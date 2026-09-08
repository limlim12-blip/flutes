package db

import (
	"context"
	"fmt"
	"lim/pkg/logger"
	"time"

	"lim/internal/config"
	"lim/internal/db/repository"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPgxPool(ctx context.Context) (*pgxpool.Pool, error) {
	dbCfg, err := pgxpool.ParseConfig(config.GetConfig().DB.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to parse database configuration: %w", err)
	}
	dbCfg.MaxConns = config.GetConfig().DB.MaxOpenConns
	dbCfg.MinConns = 5
	pool, err := pgxpool.NewWithConfig(ctx, dbCfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create database connection pool: %w", err)
	}
	ctxq, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	if err = pool.Ping(ctxq); err != nil {
		return nil, fmt.Errorf("failed to ping pool: %w", err)
	}
	if err := prewarmDatabase(ctxq, pool); err != nil {
		logger.Sugar.Warnw("failed to prewarm database tables", "error", err)
	}
	logger.Sugar.Infow("connected to dataBase",
		"max_conns", dbCfg.MaxConns,
		"min_conns", dbCfg.MinConns,
	)
	return pool, nil
}

func NewRepo(ctx context.Context, pool *pgxpool.Pool) (*repository.Queries, error) {
	repo := repository.New(pool)
	return repo, nil

}

func prewarmDatabase(ctx context.Context, pool *pgxpool.Pool) error {
	queries := []string{
		"ALTER SYSTEM SET shared_buffers TO '4GB';", //max ram psg can allocate, defaul = 128MB
		"SELECT pg_prewarm('tmdb_movie_dataset_v11', 'buffer');",
		"SELECT pg_prewarm('idx_tmdb_title_trgm', 'buffer');",
	}
	for _, q := range queries {
		if _, err := pool.Exec(ctx, q); err != nil {
			return fmt.Errorf("prewarm query failed (%s): %w", q, err)
		}
	}

	logger.Sugar.Info("database prewarmed successfully")
	return nil
}
