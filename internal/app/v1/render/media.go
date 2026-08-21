package render

import (
	"fmt"
	. "lim/internal/app/v1"
	. "lim/internal/models"
	. "lim/internal/service"
	"lim/templates"
	"lim/templates/pages"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	handler Handler
}

func InitMetaHandler(handler Handler) MediaHandler {
	return MediaHandler{handler: handler}
}

func (h *MediaHandler) RegisterRoutes(group string) {
	courses := h.handler.Engine.Group(group)
	courses.GET("/", h.GetHome)
	courses.GET("/trending/:type/", func(c *gin.Context) {
		c.Request.URL.Path = "/trending/:type/week"
		h.handler.Engine.HandleContext(c)
	})
	courses.GET("/trending/:type/:time_window", h.GetMediaTrending)
	courses.GET("/search/:type", h.GetMediaSearch)
	courses.GET("/title/:type/:id", h.GetMetaDetail)
	courses.GET("/:type/:id/season/:season_number", h.GetMetaSeasonDetail)
}

func (h *MediaHandler) GetMetaSeasonDetail(c *gin.Context) {
	var query TmdbQuery
	var uri UriParams
	if !BindAndValidateParams(c, &uri, &query, nil) {
		return
	}
	data, err := FetchMetaSeasonDetail(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err.Error())})
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.MediaSeasonDetail(data))
		return
	}
	bodyContent := pages.MediaSeasonDetail(data)
	metaTags := pages.MetaTags(
		"gowebly, htmx example page, go with htmx",
		"Welcome to example! You're here because it worked out.",
	)
	indexTemplate := templates.Layout(
		"Welcome to example!",
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}

func (h *MediaHandler) GetMetaDetail(c *gin.Context) {
	var query TmdbQuery
	var uri UriParams
	if !BindAndValidateParams(c, &uri, &query, nil) {
		return
	}
	data, err := FetchMetaDetail(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err.Error())})
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.MediaDetail(data))
		return
	}
	bodyContent := pages.MediaDetail(data)
	metaTags := pages.MetaTags(
		"gowebly, htmx example page, go with htmx",
		"Welcome to example! You're here because it worked out.",
	)
	indexTemplate := templates.Layout(
		"Welcome to example!",
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}
func (h *MediaHandler) GetHome(c *gin.Context) {
	var query TmdbQuery
	if !BindAndValidateParams(c, nil, &query, nil) {
		return
	}
	mv_uri := MediaTrendingUriParams{Type: "movie", TimeWindow: "day"} //mv
	mv_data, err := FetchMediaTrending(query, mv_uri)
	tv_uri := MediaTrendingUriParams{Type: "tv", TimeWindow: "day"} //tv
	tv_data, err := FetchMediaTrending(query, tv_uri)
	daily_uri := MediaTrendingUriParams{Type: "all", TimeWindow: "day"} //daily
	daily_data, err := FetchMediaTrending(query, daily_uri)

	bodyContent := pages.MediaHome(daily_data.Results, tv_data.Results, mv_data.Results)
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, bodyContent)
		return
	}

	metaTags := pages.MetaTags(
		"gowebly, htmx example page, go with htmx",
		"Welcome to example! You're here because it worked out.",
	)
	indexTemplate := templates.Layout(
		"Welcome to example!",
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err)})
	}
}

func (h *MediaHandler) GetMediaTrending(c *gin.Context) {
	var query TmdbQuery
	var uri MediaTrendingUriParams
	if !BindAndValidateParams(c, &uri, &query, nil) {
		return
	}
	data, err := FetchMediaTrending(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err.Error())})
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.MediaTrending(data))
		return
	}
	bodyContent := pages.MediaTrending(data)
	metaTags := pages.MetaTags(
		"gowebly, htmx example page, go with htmx",
		"Welcome to example! You're here because it worked out.",
	)
	indexTemplate := templates.Layout(
		"Welcome to example!",
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}

func (h *MediaHandler) GetMediaSearch(c *gin.Context) {
	var query TmdbQuery
	var uri UriParams
	if !BindAndValidateParams(c, &uri, &query, nil) {
		return
	}
	data, err := FetchMediaSearch(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err.Error())})
		return

	}
	bodyContent := pages.MediaSearch(data, query.Query)
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, bodyContent)
		return
	}
	metaTags := pages.MetaTags(
		"gowebly, htmx example page, go with htmx",
		"Welcome to example! You're here because it worked out.",
	)

	indexTemplate := templates.Layout(
		"Welcome to example!",
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}
