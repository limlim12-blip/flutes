package api

import (
	"context"
	. "lim/internal/app/v1"
	"lim/internal/errors"
	"lim/internal/models"
	"time"

	"lim/pkg/broker"

	"github.com/gin-gonic/gin"
)

type CrawlerRouter struct {
	*Handler
}

func InitCrawlerRouter(router string, app *Handler) {
	var u = CrawlerRouter{app}
	u.RegisterRoutes(router)
}

func (h *CrawlerRouter) RegisterRoutes(group string) {
	crawlerGroup := h.Engine.Group(group)
	{
		crawlerGroup.POST("/:action", h.handleCrawlerSignal)
	}
}

func (h *CrawlerRouter) handleCrawlerSignal(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	var uri models.CrawlerControlUri
	if err := BindAndValidateParams(c, &uri, nil, nil); err != nil {
		c.Error(err)
		return
	}
	defer cancel()
	value, err := f(ctx, uri.Action, models.CrawlerControl, h.Broker)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(200, value)
}

// move to service some how
func f(c context.Context, action models.Controler, chanel models.Route[models.Controler], brokerChan *broker.Broker) (map[string]any, *errors.ApiError) {
	ctx, cancel := context.WithTimeout(c, 3*time.Second)
	defer cancel()
	if err := brokerChan.Publish(ctx, chanel, action); err != nil {
		return nil, errors.NewInternal("Failed to communicate with broker", err)
	}
	// if receivers == 0 {
	// ch, _ := brokerChan.GetChan()
	// if len(ch) != 0 {
	// 	Sugar.Infow(fmt.Sprintf("%s crawler", action),
	// 		"status", "no active crawler workers listening",
	// 		"action", action,
	// 		"workers", 0,
	// 	)
	//
	// 	return http.StatusAccepted, gin.H{
	// 		"status":  "no active crawler workers listening",
	// 		"action":  action,
	// 		"workers": 0,
	// 	}
	// }

	return gin.H{
		"status": "Signal sent",
		"action": action,
	}, nil

}
