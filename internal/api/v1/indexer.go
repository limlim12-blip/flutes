package v1

import (
	"github.com/gin-gonic/gin"
)

type IndexerHandler struct {
	*APIHandler
}

func (h *IndexerHandler) RegisterRoutes() {
	courses := h.RouterGroup.Group("/meta")
	courses.GET("/indexer/search/:imdb_id", h.IndexerSearch)
	courses.GET("/indexer/stats", h.IndexerStats)
}

func (h *IndexerHandler) IndexerSearch(c *gin.Context) {

}

func (h *IndexerHandler) IndexerStats(c *gin.Context) {

}
