package main

import (
	"errors"
	"lim/internal/app"
	"lim/internal/config"
	"lim/internal/server"
	"lim/pkg/logger"
	"net/http"
)

func main() {
	Cfg := config.GetConfig()
	if err := config.Load("./config.yml"); err != nil {
		panic(err)
	}
	logger.Init(Cfg.Env == "development")
	defer logger.Log.Sync()
	logger.Sugar.Infow("configuration loaded successfully", "environment", Cfg.Env)
	server, err := server.New(Cfg)
	if err != nil {
		logger.Sugar.Fatalw("fail to initialize server", "error", err)
	}
	router := app.InitRouter(server.Repo, server.Redis, server.Broker)
	server.SetupHttpServer(router)
	go func() {
		if err = server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Sugar.Fatalw("http server error", "error", err)
		}
	}()
	if err := server.ListenForInterruptSignal(); err != nil {
		logger.Sugar.Errorw("server forced to shutdown ungracefully", "error", err)

	} // -> block
	logger.Sugar.Infow("application exited")

}
