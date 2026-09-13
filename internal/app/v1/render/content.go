package render

import (
	"fmt"
	. "lim/internal/app/v1"
	"lim/internal/db/repository"
	"lim/internal/errors"
	. "lim/internal/models"
	. "lim/pkg/logger"
	"lim/templates/pages"

	"github.com/gin-gonic/gin"
)

type ContentHandler struct {
	*Handler
}

func InitContentHandler(router string, handler *Handler) {
	m := ContentHandler{handler}
	m.RegisterRoutes(router)
}

func (h *ContentHandler) RegisterRoutes(group string) {
	courses := h.Engine.Group(group)
	courses.GET("/:type/:id", h.getContent)
	// courses.GET("tmdbId/tv/:tmdb_id/season/:season")
	// courses.GET("tmdbId/tv/:tmdb_id/season/:season/episode/:episode")
}

func (h *ContentHandler) getContent(c *gin.Context) {
	var query TMDBFilter
	var uri TMDBUri
	if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
		c.Error(err)
		return
	}
	var a = repository.GetFilteredTorrentContentsParams{
		MatchID:    &uri.ID,
		Type:       &uri.Type,
		Episode:    query.Episode,
		Quality:    query.Quality,
		Resolution: query.Resolution,
		Season:     query.Season,
		PageOffset: (query.Page - 1) * 20,
		PageLimit:  20,
	}
	content, err := h.Repo.GetFilteredTorrentContents(c, a)
	path := c.Request.URL.Path
	cquery := c.Request.URL.RawQuery
	Sugar.Debugw("get content detail", "path", path, "query", cquery, "content", content, "sqlc query", fmt.Sprintf("%+v", a))

	if err != nil {
		c.Error(errors.NewInternal("Upstream parsing failed", err))
		return
	}
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.DisplayContent(content))
		return
	}

}
