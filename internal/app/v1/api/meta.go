package api

import (
	"github.com/gin-gonic/gin"
	. "lim/internal/app/v1"
)

type MetaRouter struct {
	*APIRouter
}

func InitMetaRouter(app *APIRouter) MetaRouter {
	return MetaRouter{app}
}

func (h *MetaRouter) RegisterRoutes(group string) {
	courses := h.APIRouter.Engine.Group(group)
	courses.GET("/discover/:type", h.GetMediaTrending)
	courses.GET("/search/:type", h.GetMediaSearch)
	courses.GET("/title/:type/:id", h.GetMetaDetail)
	courses.GET("/title/:type/:id/seasons", h.GetMetaSeason)
}

func (h *MetaRouter) GetMetaSeason(c *gin.Context) {
}
func (h *MetaRouter) GetMediaTrending(c *gin.Context) {
	// var query TmDBMediaTrendingQuery
	// var uri TmDBMediaTrendingUri
	//
	// if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
	// 	c.Error(err)
	// 	return
	// }
	// data, err := FetchMediaTrending(c.Request.Context(), query, uri)
	// if err != nil {
	// 	c.Error(err)
	// 	return
	// }
	// c.JSON(200, data)
}

func (h *MetaRouter) GetMetaDetail(c *gin.Context) {
	// var query TmdbQuery
	// var uri TmDBUri
	// if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
	// 	c.Error(err)
	// 	return
	// }
	//
	// data, err := FetchMetaDetail(c.Request.Context(), query, uri)
	// if err != nil {
	// 	c.Error(err)
	// 	return
	// }
	// c.JSON(200, data)
}

func (h *MetaRouter) GetMediaSearch(c *gin.Context) {
	// var query TmdbQuery
	// var uri TmDBUri
	// if err := BindAndValidateParams(c, &uri, &query, nil); err != nil {
	// 	c.Error(err)
	// 	return
	// }
	// data, err := FetchMediaSearch(c.Request.Context(), query, uri)
	// if err != nil {
	// 	c.Error(err)
	// 	return
	// }
	// c.JSON(200, data)
}
