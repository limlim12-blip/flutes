package render

import (
	. "lim/internal/app/v1"
	"lim/internal/errors"
	"lim/templates"
	"net/http"
	"os"
	"path/filepath"

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
	courses.GET("/", h.Video)
	courses.GET("/session/:session/ping", h.Heartbeat)
}

func (h *VideoHandler) Video(c *gin.Context) {
	hash := c.Query("hash")
	file := c.Query("file")
	newID := uuid.New()
	(*h.TranscodeSessions)[newID] = NewSession(hash, file, 0, newID, h.Client)
	// (*h.TranscodeSessions)[newID].GetReader(c, hash, file)
	(*h.TranscodeSessions)[newID].Cmd.Start()
	c.Request.Header.Add("X-Watch-Session", newID.String())
	//hash=faa57196ee35b95c10b68eeea0a4f1b8e6a3bd1f&file=Silo+(2023)+-+S01E07+-+The+Flamekeepers+(1080p+ATVP+WEB-DL+x265+t3nzin).mkv
	bodyContent := pages.VideoPlayerView(newID.String(), 5)
	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, bodyContent)
		return
	}
	metaTags := templates.MetaTags(
		"gowebly, htmx example page, go with htmx",
		"Welcome to example! You're here because it worked out.",
	)
	indexTemplate := templates.Layout(
		"Welcome to example!",
		metaTags,
		bodyContent,
	)
	HtmxRender(c, indexTemplate)

}

func (h *VideoHandler) Heartbeat(c *gin.Context) {
	sessionKey := c.Param("session")
	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("invalid session uuid", nil))
		return
	}
	ss, exists := (*h.TranscodeSessions)[ssid]
	if !exists {
		c.Status(http.StatusNotFound)
	}
	mpdPath := filepath.Join(ss.Path, "manifest.mpd")
	if _, err := os.Stat(mpdPath); err == nil {
		HtmxRender(c, pages.VideoPlayerReady(ssid.String()))
		return
	}
	c.Status(http.StatusNoContent)
	//TODO: dead -> delete
}
