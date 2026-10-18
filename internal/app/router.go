package app

import (
	v1 "lim/internal/app/v1"
	api_v1 "lim/internal/app/v1/api"
	render_v1 "lim/internal/app/v1/render"
	"lim/internal/db/repository"
	"lim/internal/middleware"
	"lim/pkg/broker"
	"lim/pkg/logger"
	"mime"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

func InitRouter(repo *repository.Queries, rdb *redis.Client, broker *broker.Broker) *gin.Engine {
	mime.AddExtensionType(".mpd", "application/dash+xml")
	mime.AddExtensionType(".m4s", "video/iso.segment")
	r := gin.Default()
	r.SetTrustedProxies(nil)
	corsConfig := cors.Config{
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	// if config.GetConfig().Env == "development" {
	corsConfig.AllowAllOrigins = true
	// } else {
	// 	corsConfig.AllowOrigins = config.GetConfig().HTTP.CORSAllowedOrigins
	// }
	r.Static("/static", "./static")
	// CacheControlMiddleware := func() gin.HandlerFunc {
	// 	return func(c *gin.Context) {
	// 		c.Header("Cache-Control", "public, max-age=31536000, immutable")
	// 		c.Next()
	// 	}
	// }
	// staticGroup := r.Group("/static", CacheControlMiddleware())
	// {
	// 	staticGroup.Static("/", "./static")
	// }
	r.Use(middleware.Ginzap(logger.Log, time.RFC3339, true))
	r.Use(middleware.RecoveryWithZap(logger.Log, false))
	r.Use(middleware.ErrorHandler())
	hand := &v1.Handler{
		Engine:            r,
		TranscodeSessions: new(make(map[uuid.UUID]*v1.TranscodeSession)),
		Client:            api_v1.NewClient(),
		Repo:              repo,
		Broker:            broker,
		Rdb:               rdb,
		Repository:        repo,
	}

	//render
	render_v1.InitMetaHandler("/", hand)
	render_v1.InitContentHandler("/tmdbId/", hand)
	render_v1.InitVideoHandler("/video", hand)
	//API
	api_v1.InitMetaRouter("api/v1/meta", hand)
	api_v1.InitCrawlerRouter("api/v1/crawler", hand)

	api_v1.InitVideoRouter("api/v1/video", hand)
	api_v1.InitInternalRouter("api/v1/internal/", hand)

	return r
}
