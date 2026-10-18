package render

import (
	"fmt"
	. "lim/internal/app/v1"
	"lim/internal/errors"
	"lim/templates"
	"net/http"
	"time"

	"github.com/a-h/templ"
	"github.com/angelofallars/htmx-go"
	"github.com/google/uuid"

	"lim/templates/pages"

	"github.com/gin-gonic/gin"
)

type VideoHandler struct {
	*Handler
}

func InitVideoHandler(router string, handler *Handler) {
	m := VideoHandler{handler}
	m.RegisterRoutes(router)
}

func (h *VideoHandler) RegisterRoutes(group string) {
	courses := h.Engine.Group(group)
	courses.GET("/start", h.Video)
	courses.GET("/session/:session", h.VideoSession)
	courses.GET("/session/:session/keepalive", h.KeepAlive)
}

func (h *VideoHandler) Video(c *gin.Context) {
	if !htmx.IsHTMX(c.Request) {
		c.Error(errors.NewBadRequest("not a htmx request", fmt.Errorf("missing HX-Request = true")))
		return
	}
	hash := c.Query("hash")
	file := c.Query("file")
	ss, err := NewSession(hash, file, 0, h.Client)
	if err != nil {
		c.Error(errors.NewInternal("something something", err))
	}
	(*h.TranscodeSessions)[ss.GetID()] = ss
	if err := ss.CONT(); err != nil {
		c.Error(err)
		return
	}
	//hash=faa57196ee35b95c10b68eeea0a4f1b8e6a3bd1f&file=Silo+(2023)+-+S01E07+-+The+Flamekeepers+(1080p+ATVP+WEB-DL+x265+t3nzin).mkv
	HtmxRender(c, pages.VideoLoadingView(ss.GetID().String()))
	return
}
func (h *VideoHandler) VideoSession(c *gin.Context) {
	sessionKey := c.Param("session")
	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.String(http.StatusBadRequest, "invalid session uuid")
		return
	}

	ss, exists := (*h.TranscodeSessions)[ssid]
	var bodyContent templ.Component
	if !exists {
		bodyContent := pages.VideoEmptyView()
		if htmx.IsHTMX(c.Request) {
			HtmxRender(c, bodyContent)
			return
		}
		c.Error(errors.NewNotFount("Session has expired or does not exist.", nil))
		return
	}
	if ss.GetManifest() != nil {
		bodyContent = pages.VideoPlayingView(ssid.String())
	} else {
		bodyContent = pages.VideoLoadingView(ssid.String())
	}
	if htmx.IsHTMX(c.Request) {
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
func (h *VideoHandler) KeepAlive(c *gin.Context) {
	if !htmx.IsHTMX(c.Request) {
		c.Error(errors.NewBadRequest("not a htmx request", fmt.Errorf("missing HX-Request = true")))
		return
	}
	sessionKey := c.Param("session")
	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("invalid session uuid", nil))
		return
	}
	ss, exists := (*h.TranscodeSessions)[ssid]
	if !exists {
		c.Status(htmx.StatusStopPolling)
		HtmxRender(c, pages.VideoEmptyView())
		return
	}
	ss.SetLastActiveTime(time.Now().Unix())
	c.Status(http.StatusNoContent)
}
