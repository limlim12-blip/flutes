package v1

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type CrawlerHandler struct {
	*APIHandler
	rdb *redis.Client
}

func InitCrawlerHandler(app *APIHandler, rdb *redis.Client) CrawlerHandler {
	var u = CrawlerHandler{rdb: rdb}
	u.APIHandler = app
	return u
}

func (h *CrawlerHandler) RegisterRoutes() {
	crawlerGroup := h.RouterGroup.Group("/api/crawler")
	{
		crawlerGroup.POST("/start", h.handleCrawlerSignal("start"))
		crawlerGroup.POST("/stop", h.handleCrawlerSignal("stop"))
	}
}

func (h *CrawlerHandler) handleCrawlerSignal(action string) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
		defer cancel()

		cmd := h.rdb.Publish(ctx, "crawler_control", action)
		if err := cmd.Err(); err != nil {
			c.JSON(500, gin.H{
				"error":   "Failed to communicate with Redis",
				"details": err.Error(),
			})
			return
		}

		receivers := cmd.Val()
		if receivers == 0 {
			c.JSON(http.StatusAccepted, gin.H{
				"status":  "no active crawler workers listening",
				"action":  action,
				"workers": 0,
			})
			return
		}

		c.JSON(200, gin.H{
			"status":  "Signal sent successfully",
			"action":  action,
			"workers": receivers,
		})
	}
}
