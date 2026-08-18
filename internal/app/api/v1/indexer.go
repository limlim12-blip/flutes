package v1

import (
	"github.com/gin-gonic/gin"
)

type IndexerRouter struct {
	*APIRouter
}

func (h *IndexerRouter) RegisterRoutes() {
	courses := h.RouterGroup.Group("/meta")
	courses.GET("/indexer/search/:imdb_id", h.IndexerSearch)
	courses.GET("/indexer/stats", h.IndexerStats)
}

func (h *IndexerRouter) IndexerSearch(c *gin.Context) {

}

func (h *IndexerRouter) IndexerStats(c *gin.Context) {

}
