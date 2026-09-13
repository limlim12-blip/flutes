package api

import (
	"fmt"
	. "lim/internal/app/v1"
	"lim/internal/errors"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type VideoRouter struct {
	*Handler
}

func InitVideoRouter(router string, app *Handler) {
	m := VideoRouter{app}
	m.RegisterRoutes(router)
}

func (s *VideoRouter) RegisterRoutes(group string) {
	courses := s.Engine.Group(group)
	courses.GET("/session/:session/hash/:hash/stream", s.ServeTorrent)
	courses.GET("/session/:session/dash/:filename", s.ServeFile)
	// courses.POST("/session/:session/heartbeat", s.Heartbeat)
}

func (s *VideoRouter) ServeTorrent(c *gin.Context) {
	hash := c.Param("hash")
	sessionKey := c.Param("session")
	target := c.Query("filepath")
	if sessionKey == "" {
		c.Error(errors.NewBadRequest("missing X-Watch-Session header", nil))
		return
	}
	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("invalid session uuid", nil))
		return
	}
	ss, exists := (*s.TranscodeSessions)[ssid]
	if !exists {
		c.Error(errors.NewBadRequest("session does not exist", nil))
		return
	}
	reader, err := ss.GetReader(c, hash, target)
	if err != nil {
		c.Error(errors.NewInternal("failed to setup torrent reader", err))
		return
	}
	defer reader.Close()
	http.ServeContent(c.Writer, c.Request, ss.Torfile.DisplayPath(), time.Now(), reader)
}

func (s *VideoRouter) ServeFile(c *gin.Context) {
	sessionKey := c.Param("session")
	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("invalid session uuid", nil))
		return
	}
	filename := c.Param("filename")
	ss, exists := (*s.TranscodeSessions)[ssid]
	if !exists {
		c.Status(http.StatusNotFound)
	}
	safePath := filepath.Join(ss.Path, filename)
	//TODO: control ffmpeg folow
	if _, err := os.Stat(safePath); os.IsNotExist(err) {
		c.String(http.StatusNotFound, "chunk not ready")
		return
	}
	if filename == "manifest.mpd" {
		mpdBytes, err := os.ReadFile(safePath)
		if err != nil {
			c.String(http.StatusNotFound, "Manifest not ready")
			return
		}

		mpdStr := string(mpdBytes)

		//HACK: good stuff
		// 1. Change dynamic to static and inject your fixed duration
		// (Assuming you have your duration string like "PT1422.5S" in a variable)
		fixedDuration := "PT1422.5S" // Replace with your actual dynamic duration variable
		replacement := fmt.Sprintf(`type="static" mediaPresentationDuration="%s"`, fixedDuration)
		mpdStr = strings.Replace(mpdStr, `type="dynamic"`, replacement, 1)

		// 2. Dash.js will CRASH if a static VOD file has these live-stream tags.
		// We MUST regex them out completely.
		reLiveTags := regexp.MustCompile(`(?m)(minimumUpdatePeriod|suggestedPresentationDelay|availabilityStartTime|publishTime)="[^"]+"\s*`)
		mpdStr = reLiveTags.ReplaceAllString(mpdStr, "")

		// 3. Serve the clean, fixed-length manifest
		c.Data(http.StatusOK, "application/dash+xml", []byte(mpdStr))
		return
	} else {
		c.Header("Content-Type", "video/iso.segment")
		c.File(safePath)
	}
}
