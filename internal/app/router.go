package app

import (
	"lim/db/repository"
	"lim/internal/app/v1"
	api_v1 "lim/internal/app/v1/api"
	render_v1 "lim/internal/app/v1/render"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func InitRouter(repo *repository.Queries, rdb *redis.Client) *gin.Engine {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	r.Static("/static", "./static")
	//render
	web := v1.Handler{Engine: r}
	mediaHandler := render_v1.InitMetaHandler(web)
	mediaHandler.RegisterRoutes("/")

	//API
	app := &v1.APIRouter{Engine: r, Repository: repo}
	mediaRouter := api_v1.InitMetaRouter(app)
	mediaRouter.RegisterRoutes("api/v1/meta")

	crawlerRouter := api_v1.InitCrawlerRouter(app, rdb)
	crawlerRouter.RegisterRoutes("api/v1/crawler")

	return r
}
