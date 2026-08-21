package api

import (
	"github.com/gin-gonic/gin"
	. "lim/internal/app/v1"
)

type IndexerRouter struct {
	*APIRouter
}

func (h *IndexerRouter) RegisterRoutes() {
	courses := h.Engine.Group("/meta")
	courses.GET("/indexer/search/:imdb_id", h.IndexerSearch)
	courses.GET("/indexer/stats", h.IndexerStats)
}

func (h *IndexerRouter) IndexerSearch(c *gin.Context) {

}

func (h *IndexerRouter) IndexerStats(c *gin.Context) {

}
