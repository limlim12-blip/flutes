package api

import (
	"lim/db/repository"
	v1 "lim/internal/api/v1"
	"lim/pkg/gintemplrenderer"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

func InitRouter(pool *pgxpool.Pool, rdb *redis.Client) *gin.Engine {
	repo := repository.New(pool)
	r := gin.Default()

	r.LoadHTMLGlob("/app/template/*")
	ginHtmlRenderer := r.HTMLRender
	r.HTMLRender = &gintemplrenderer.HTMLTemplRenderer{FallbackHtmlRenderer: ginHtmlRenderer}
	r.SetTrustedProxies(nil)

	//render
	web := r.Group("/")
	{
		web.GET("/media/", func(c *gin.Context) {
			c.HTML(http.StatusOK, "index.html", gin.H{})
		})
		web.GET("/media/:path", func(c *gin.Context) {
			path := c.Param("path")
			c.HTML(http.StatusOK, "video.html", gin.H{
				"title": "FastAPI Video Streaming",
				"path":  path,
			})
		})

	}
	//API
	api_v1 := r.Group("/v1")
	app := &v1.APIHandler{RouterGroup: api_v1, Repository: repo}

	mediaHandler := v1.InitMetaHandler(app)
	mediaHandler.RegisterRoutes()

	crawlerHandler := v1.InitCrawlerHandler(app, rdb)
	crawlerHandler.RegisterRoutes()

	return r
}
