package render

import (
	"fmt"
	. "lim/internal/app/v1"
	. "lim/internal/models"
	. "lim/internal/service"
	"lim/templates"
	"lim/templates/pages"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	*Handler
}

func InitMetaHandler(router string, handler *Handler) {
	m := MediaHandler{handler}
	m.RegisterRoutes(router)
}

func (h *MediaHandler) RegisterRoutes(group string) {
	courses := h.Engine.Group(group)
	courses.GET("/", h.GetHome)
	courses.GET("/trending/type/:type", func(c *gin.Context) {
		mediaType := c.Param("type")
		c.Request.URL.Path = fmt.Sprintf("/trending/%s/week", mediaType)
		h.Engine.HandleContext(c)
	})
	courses.GET("/trending/type/:type/:time_window", h.GetMediaTrending)
	courses.GET("/search/type/:type", h.GetMediaSearch)
	courses.GET("/detail/type/:type/id/:id", h.GetMetaDetail)
	courses.GET("/detail/type/:type/id/:id/season/:season_number", h.GetMetaSeasonDetail)
}

var title = "Welcome to example!"
var metaTags = templates.MetaTags(
	"gowebly, htmx example page, go with htmx",
	"Welcome to example! You're here because it worked out.",
)

func (h *MediaHandler) GetMetaSeasonDetail(c *gin.Context) {
	var query TmDBMetaDetailQuery
	var uri TmDBMetaSeasonDetailUri
	if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
		c.Error(err)
		return
	}
	data, err := FetchMetaSeasonDetail(c, query, uri)
	if err != nil {
		c.Error(err)
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.MediaSeasonDetail(data))
		return
	}
	bodyContent := pages.MediaSeasonDetail(data)
	indexTemplate := templates.Layout(
		title,
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}

func (h *MediaHandler) GetMetaDetail(c *gin.Context) {
	var query TmDBMetaDetailQuery
	var uri TmDBMetaDetailUri
	if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
		c.Error(err)
		return
	}
	data, err := FetchMetaDetail(c, query, uri)
	if err != nil {
		c.Error(err)
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.MediaDetail(data))
		return
	}
	bodyContent := pages.MediaDetail(data)
	indexTemplate := templates.Layout(
		title,
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}
func (h *MediaHandler) GetHome(c *gin.Context) {
	// var query TmdbQuery
	// if err := BindAndValidateParams(c, nil, &query, nil); err != nil {
	// 	c.Error(err)
	// 	return
	// }
	query := TmDBMediaTrendingQuery{Page: 1}
	mv_data, err := FetchMediaTrending(c, query, TmDBMediaTrendingUri{Type: "movie", TimeWindow: "week"})
	if err != nil {
		c.Error(err)
	}
	tv_data, err := FetchMediaTrending(c, query, TmDBMediaTrendingUri{Type: "tv", TimeWindow: "week"})
	if err != nil {
		c.Error(err)
	}
	daily_data, err := FetchMediaTrending(c, query, TmDBMediaTrendingUri{Type: "all", TimeWindow: "day"})
	if err != nil {
		c.Error(err)
	}
	if len(c.Errors) > 0 {
		return
	}
	bodyContent := pages.MediaHome(daily_data.Results, tv_data.Results, mv_data.Results)
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, bodyContent)
		return
	}

	indexTemplate := templates.Layout(
		title,
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}

func (h *MediaHandler) GetMediaTrending(c *gin.Context) {
	var query TmDBMediaTrendingQuery
	var uri TmDBMediaTrendingUri
	if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
		c.Error(err)
		return
	}
	data, err := FetchMediaTrending(c, query, uri)
	if err != nil {
		c.Error(err)
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.MediaTrending(data))
		return
	}
	bodyContent := pages.MediaTrending(data)
	indexTemplate := templates.Layout(
		title,
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}

func (h *MediaHandler) GetMediaSearch(c *gin.Context) {
	var query TmDBMediaSearchQuery
	var uri TmDBMediaSearchUri
	if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
		c.Error(err)
		return
	}
	data, err := FetchMediaSearch(c, query, uri)
	if err != nil {
		c.Error(err)
		return
	}
	bodyContent := pages.MediaSearch(data, query.Query)
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, bodyContent)
		return
	}

	indexTemplate := templates.Layout(
		title,
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)
}
