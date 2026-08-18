package app

import (
	"lim/db/repository"
	v1 "lim/internal/app/api/v1"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func InitRouter(repo *repository.Queries, rdb *redis.Client) *gin.Engine {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	//render
	web := r.Group("/render/v1")
	{
		web.GET("/media/")
	}
	//API
	api_v1 := r.Group("api/v1")
	app := &v1.APIRouter{RouterGroup: api_v1, Repository: repo}

	mediaHandler := v1.InitMetaHandler(app)
	mediaHandler.RegisterRoutes()

	crawlerHandler := v1.InitCrawlerHandler(app, rdb)
	crawlerHandler.RegisterRoutes()

	return r
}
