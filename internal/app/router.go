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

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
	r.Use(middleware.Ginzap(logger.Log, time.RFC3339, true))
	r.Use(middleware.RecoveryWithZap(logger.Log, false))
	r.Use(middleware.ErrorHandler())
	//render
	web := v1.Handler{Engine: r}
	mediaHandler := render_v1.InitMetaHandler(web)
	mediaHandler.RegisterRoutes("/")

	videoHandler := render_v1.InitVideoHandler(web)
	videoHandler.RegisterRoutes("/video")

	contentHandler := render_v1.InitContentHandler(web, repo)
	contentHandler.RegisterRoutes("/")

	//API
	app := &v1.APIRouter{Engine: r, Repository: repo}
	mediaRouter := api_v1.InitMetaRouter(app)
	mediaRouter.RegisterRoutes("api/v1/meta")

	crawlerRouter := api_v1.InitCrawlerRouter(app, rdb, broker)
	crawlerRouter.RegisterRoutes("api/v1/crawler")

	StreamRouter := api_v1.InitVideoRouter(app)
	StreamRouter.RegisterRoutes("api/v1/video")
	InternalRouter := api_v1.InternalRouter{APIRouter: app}
	InternalRouter.RegisterRoutes("internal/")

	return r
}
