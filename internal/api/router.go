package api

import (
	"lim/internal/api/v1"
	"lim/pkg/gintemplrenderer"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.Default()
	// web
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
	//api
	api_v1 := r.Group("/v1")
	app := &v1.APIHandler{RouterGroup: api_v1}

	mediaHandler := &v1.MediaHandler{Handler: app}
	mediaHandler.RegisterRoutes()

	apiv1 := r.Group("/api/v1")
	{
		apiv1.GET("/stream-video/*path", v1.GetVideoChunk)
	}
	return r
}
