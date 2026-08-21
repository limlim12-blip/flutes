package api

import (
	"context"
	. "lim/internal/app/v1"
	"lim/internal/config"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type CrawlerRouter struct {
	*APIRouter
	rdb *redis.Client
}

func InitCrawlerRouter(app *APIRouter, rdb *redis.Client) CrawlerRouter {
	var u = CrawlerRouter{rdb: rdb}
	u.APIRouter = app
	return u
}

func (h *CrawlerRouter) RegisterRoutes(group string) {
	crawlerGroup := h.Engine.Group(group)
	{
		crawlerGroup.POST("/start", h.handleCrawlerSignal("start", config.ChannelCrawlerControl))
		crawlerGroup.POST("/stop", h.handleCrawlerSignal("stop", config.ChannelCrawlerControl))
	}
}

func (h *CrawlerRouter) handleCrawlerSignal(action string, chanel string) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
		defer cancel()
		status, value := f(ctx, h.rdb, action, chanel)
		c.JSON(status, value)
	}
}
func f(c context.Context, rdb *redis.Client, action string, chanel string) (int, map[string]any) {
	ctx, cancel := context.WithTimeout(c, 3*time.Second)
	defer cancel()
	cmd := rdb.Publish(ctx, chanel, action)
	if err := cmd.Err(); err != nil {
		return 500, gin.H{
			"error":   "Failed to communicate with Redis",
			"details": err.Error(),
		}
	}
	receivers := cmd.Val()
	if receivers == 0 {
		return http.StatusAccepted, gin.H{
			"status":  "no active crawler workers listening",
			"action":  action,
			"workers": 0,
		}
	}

	return 200, gin.H{
		"status":  "Signal sent",
		"action":  action,
		"workers": receivers,
	}

}
