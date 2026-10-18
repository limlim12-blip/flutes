package server

import (
	"context"
	"errors"
	"fmt"
	"lim/internal/config"
	"lim/internal/db"
	"lim/internal/db/repository"
	"lim/internal/worker"
	"lim/pkg/broker"
	"lim/pkg/logger"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type Server struct {
	Config     *config.Config
	Logger     *zap.Logger
	Repo       *repository.Queries
	Redis      *redis.Client
	DB         *pgxpool.Pool
	httpServer *http.Server
	wokers     []worker.Woker
	Broker     *broker.Broker
}

func New(cfg *config.Config) (*Server, error) {
	ctx := context.Background()
	// Db
	pool, err := db.NewPgxPool(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}
	if err := db.Migrate(pool); err != nil {
		return nil, fmt.Errorf("database migration failed: %w", err)
	}

	repo, err := db.NewRepo(ctx, pool)
	if err != nil {
		return nil, fmt.Errorf("failed to init repo: %w", err)
	}
	// redis
	ctxrd, cancel := context.WithTimeout(ctx, 5*time.Second)
	rdb := redis.NewClient(&redis.Options{Addr: fmt.Sprintf("%s:%d", cfg.Redis.Host, cfg.Redis.Port)})
	defer cancel()

	if err := rdb.Ping(ctxrd).Err(); err != nil {
		logger.Sugar.Errorw("faild to ping redis", "error", err)
	}
	// broker
	broker := broker.NewBroker(broker.NewBrokerChan())

	// job
	var wokes []worker.Woker
	WokeTorHub, err := worker.InitTorHub(ctx, rdb, repo, broker)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize TorHub worker: %w", err)
	}
	wokes = append(wokes, WokeTorHub)

	return &Server{
		Config: cfg,
		Repo:   repo,
		Redis:  rdb,
		DB:     pool,
		Broker: broker,
		wokers: wokes,
	}, nil
}
func (s *Server) SetupHttpServer(handler http.Handler) {
	s.httpServer = &http.Server{
		Addr:         fmt.Sprintf(":%d", s.Config.HTTP.Port),
		Handler:      handler,
		ReadTimeout:  2 * time.Hour,
		WriteTimeout: 2 * time.Hour,
		IdleTimeout:  120 * time.Second,
		// ReadTimeout: time.Duration(s.Config.HTTP.ReadTimeout) * time.Second,
		// // WriteTimeout: time.Duration(s.Config.HTTP.WriteTimeout) * time.Second,
		// IdleTimeout: time.Duration(s.Config.HTTP.IdleTimeOut) * time.Second,
	}
}

func (s *Server) ListenAndServe() error {
	if s.httpServer == nil {
		return fmt.Errorf("http not yet setup")
	}
	// if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
	// 	logger.Sugar.Fatalw("http server crashed", "error", err)
	// }
	for _, woke := range s.wokers {
		go func(w worker.Woker) {
			if err := w.ListenAndServe(); err != nil && !errors.Is(err, context.Canceled) {
				logger.Sugar.Errorw("worker crashed", "name", w.GetName(), "error", err)
			}
			logger.Sugar.Infow("worker stopped", "name", w.GetName())
		}(woke)
	}
	logger.Sugar.Infow("starting http server", "port", s.Config.HTTP.Port, "env", s.Config.Env)
	return s.httpServer.ListenAndServe()
}
func (s *Server) ListenForInterruptSignal() error {
	// server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Sugar.Infow("shutdown signal received, graceful shutdown...ing")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	return s.Shutdown(shutdownCtx)
}
func (s *Server) Shutdown(ctx context.Context) error {
	logger.Sugar.Info("shutting down HTTP server...")
	if err := s.httpServer.Shutdown(ctx); err != nil {
		logger.Sugar.Errorw("failed to shut down HTTP server gracefully", "error", err)
	}
	logger.Sugar.Info("shutting down background wokers...")
	for _, woke := range s.wokers {
		if err := woke.Stop(); err != nil {
			logger.Sugar.Errorw("failed to shut down woker", "name", woke.GetName(), "error", err)
		}
	}
	logger.Sugar.Info("closing database and redis connections...")
	s.DB.Close()

	if err := s.Redis.Close(); err != nil {
		logger.Sugar.Errorw("failed to close redis connection", "error", err)
	}

	logger.Sugar.Info("graceful shutdown complete")

	return nil
}
