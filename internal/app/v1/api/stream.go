package api

import (
	. "lim/internal/app/v1"
	"lim/internal/errors"
	. "lim/pkg/utils"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var Trackers string = GetTracker()

type VideoRouter struct {
	*APIRouter
	TranscodeSessions map[uuid.UUID]*TranscodeSession
}

func InitVideoRouter(app *APIRouter) VideoRouter {
	return VideoRouter{APIRouter: app, TranscodeSessions: make(map[uuid.UUID]*TranscodeSession)}
}
func (s *VideoRouter) RegisterRoutes(group string) {
	courses := s.APIRouter.Engine.Group(group)
	courses.GET("/session/:session/hash/:hash/filepath/:filepath", s.ServeTorrent)
	courses.POST("/session/:session/heartbeat", s.Heartbeat)
	courses.GET("/session/:session/hash/:hash/filepath/:filepath/filename/:filename", s.ServeFile)
	//NOTE: I think manifest should have its own endpoint(plex separate them somehow), not now
	// courses.GET("/serve/:hash/:filepath/manifest.mpd", func(c *gin.Context) {
	// 	hash := c.Param("hash")
	// 	filepathParam := c.Param("filepath")
	// 	safePath := filepath.Join(".", "tmp", hash, filepathParam, "manifest.mpd")
	// 	if _, err := os.Stat(safePath); os.IsNotExist(err) {
	// 		c.String(http.StatusNotFound, "Manifest not ready")
	// 		return
	// 	}
	// 	c.File(safePath)
	// })
}

func (s *VideoRouter) ServeTorrent(c *gin.Context) {
	hash := c.Param("hash")
	target := c.Param("filepath")
	sessionKey := c.GetHeader("X-Watch-Session")
	if sessionKey == "" {
		c.Error(errors.NewBadRequest("smth smth header", nil))
		return
	}
	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("smth smth uuid", nil))
		return
	}
	ss, exists := s.TranscodeSessions[ssid]
	if !exists {
		c.Error(errors.NewBadRequest("smth smth exists", nil))
		return
	}
	reader, err := ss.GetReader(c, hash, target)
	if err != nil {
		c.Error(errors.NewInternal("failed add magnet", err))
	}
	defer reader.Close()
	http.ServeContent(c.Writer, c.Request, ss.torfile.DisplayPath(), time.Now(), reader)
}

func (S *VideoRouter) Heartbeat(c *gin.Context) {
	sessionKey := c.GetHeader("X-Watch-Session")
	_, exists := ActiveSessions[sessionKey]
	if !exists {
		c.Header("HX-Redirect", "/video")
	}
	c.Status(http.StatusOK)

}
func (S *VideoRouter) ServeFile(c *gin.Context) {
	hash := c.Param("hash")
	filepathParam := c.Param("filepath")
	filename := c.Param("filename")
	safePath := filepath.Join(".", "tmp", hash, filepathParam, filepath.Clean("/"+filename))
	//TODO: if !exists || (ss.Cmd.ProcessState != nil && ss.Cmd.ProcessState.Exited()) {
	if _, err := os.Stat(safePath); os.IsNotExist(err) {
		c.String(http.StatusNotFound, "chunk not ready")
		return
	}
	if filename != "manifest.mpd" {
		c.Header("Content-Type", "video/iso.segment")
	} else {
		c.Header("Content-Type", "application/dash+xml")
	}
	c.File(safePath)

}
