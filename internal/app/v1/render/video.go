package render

import (
	"fmt"
	"github.com/google/uuid"
	. "lim/internal/app/v1"
	. "lim/internal/app/v1/api"
	"lim/templates"

	"lim/templates/pages"

	"github.com/anacrolix/torrent"
	"github.com/gin-gonic/gin"
)

type VideoHandler struct {
	handler           Handler
	TranscodeSessions map[uuid.UUID]*TranscodeSession
	Client            *torrent.Client
}

func InitVideoHandler(handler Handler) VideoHandler {
	return VideoHandler{handler: handler}
}

func (h *VideoHandler) RegisterRoutes(group string) {
	courses := h.handler.Engine.Group(group)
	courses.GET("/", h.Video)
}

func (h *VideoHandler) Video(c *gin.Context) {
	hash := c.Query("infohash")
	file := c.Query("file")
	newID := uuid.New()
	h.TranscodeSessions[newID] = NewSession(hash, file, newID, h.Client)
	c.Request.Header.Add("X-Watch-Session", newID.String())
	bodyContent := pages.VideoPlayerView(newID.String(), fmt.Sprintf("/api/v1/video/session/%s/hash/faa57196ee35b95c10b68eeea0a4f1b8e6a3bd1f/filepath/Silo+(2023)+-+S01E07+-+The+Flamekeepers+(1080p+ATVP+WEB-DL+x265+t3nzin).mkv/filename/manifest.mpd", newID))
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
