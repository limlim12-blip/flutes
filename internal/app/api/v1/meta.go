package v1

import (
	"fmt"
	. "lim/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MetaRouter struct {
	*APIRouter
}

func InitMetaHandler(app *APIRouter) MetaRouter {
	return MetaRouter{app}
}

func (h *MetaRouter) RegisterRoutes() {
	courses := h.APIRouter.RouterGroup.Group("/meta")
	courses.GET("/discover/:type", h.GetMediaTrending)
	courses.GET("/search/:type", h.GetMediaSearch)
	courses.GET("/title/:type/:id", h.GetMetaDetail)
	courses.GET("/title/:type/:id/seasons", h.GetMetaSeason)
}

func (h *MetaRouter) GetMetaSeason(c *gin.Context) {
}

func (h *MetaRouter) GetMediaTrending(c *gin.Context) {
	var query TmdbQuery
	var uri MediaTrendingUriParams
	if !BindAndValidateParams(c, uri, &query, nil) {
		return
	}
	data, err := FetchMediaTrending(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err)})

	}
	c.JSON(200, data)
}

func (h *MetaRouter) GetMetaDetail(c *gin.Context) {
	var query TmdbQuery
	var uri UriParams
	if !BindAndValidateParams(c, uri, &query, nil) {
		return
	}
	data, err := FetchMetaDetail(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err)})

	}
	c.JSON(200, data)
}

func (h *MetaRouter) GetMediaSearch(c *gin.Context) {
	var query TmdbQuery
	var uri UriParams
	if !BindAndValidateParams(c, uri, &query, nil) {
		return
	}
	data, err := FetchMediaSearch(query, uri)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Upstream parsing failed: %v", err)})

	}
	c.JSON(200, data)
}
