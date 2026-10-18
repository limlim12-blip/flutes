package api

import (
	. "lim/internal/app/v1"
	"lim/internal/config"
	. "lim/pkg/logger"

	"lim/internal/errors"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
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
	courses.GET("/session/:session/hls/stream/:filename", s.ServeFile)
	// courses.POST("/session/:session/heartbeat", s.Heartbeat)
}

func (s *VideoRouter) ServeTorrent(c *gin.Context) {
	hash := c.Param("hash")
	sessionKey := c.Param("session")
	target := c.Query("filepath")
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
	http.ServeContent(c.Writer, c.Request, ss.GetTorDisplayPath(), time.Now(), reader)
}

var replacer = strings.NewReplacer("chunk_", "", ".mp4", "")

func (s *VideoRouter) ServeFile(c *gin.Context) {
	sessionKey := c.Param("session")

	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("invalid session uuid", err))
		return
	}
	ss, exists := (*s.TranscodeSessions)[ssid]
	if !exists {
		c.Status(http.StatusNotFound)
		return
	}

	filename := c.Param("filename")
	safePath := filepath.Join(ss.GetMpdPath(), filename)
	//TODO: control ffmpeg folow
	if filename == "manifest.m3u8" {
		// //HACK: for DASH -> cannot change the chunk number relatively to the video, always start with one in all sessions
		//
		// fixedDuration := "PT1422.5S" // Your actual dynamic duration variable
		// replacement := fmt.Sprintf(`type="dynamic" mediaPresentationDuration="%s"`, fixedDuration)
		// mpdStr = strings.Replace(mpdStr, `type="dynamic"`, replacement, 1)
		// reUpdate := regexp.MustCompile(`minimumUpdatePeriod="[^"]+"`)
		// mpdStr = reUpdate.ReplaceAllString(mpdStr, `minimumUpdatePeriod="PT300S"`)

		// HLS
		if ss.GetManifest() == nil {
			c.Error(errors.NewInternal("manifest = nil", nil))
			return
		}
		c.Data(http.StatusOK, "application/vnd.apple.mpegurl", ss.GetManifest())
		return
	}
	//NOTE: if init.mp4 is deprecated -> video failed to play -> init.mp4 get write in place -> can be 0 size, incomplete -> failed
	if filename == "init.mp4" {
		firstChunkPath := filepath.Join(filepath.Dir(safePath), "chunk_00001.mp4")
		if _, err := os.Stat(firstChunkPath); os.IsNotExist(err) {
			c.String(http.StatusServiceUnavailable, "init chunk waiting for segment 1")
			return
		}
		c.Header("Content-Type", "video/mp4")
		c.File(safePath)
		return
	}
	chunk, err := strconv.ParseInt(replacer.Replace(filename), 10, 64)
	if err != nil {
		c.Error(errors.NewInternal("faild to parse chunk number", err))
		return
	}
	if chunk > ss.GetCurrentChunk()+10 || chunk < ss.GetLastRequestedChunk() {
		if _, err := os.Stat(safePath); os.IsNotExist(err) {
			Sugar.Debugw("setComad info", "chunk", chunk, "current_chunk", ss.GetCurrentChunk(), "last_rqst_chunk", ss.GetLastRequestedChunk())
			c.String(http.StatusNotFound, "chunk not ready")
			err1 := ss.SetCmd(chunk)
			err2 := ss.CONT()
			Sugar.Debugw("jump  errors", "cont error", err2, "setcmd error", err1)
			if err != nil {
				c.Error(errors.NewInternal("setcmd error", err1))
			}
			ss.SetLastRequestedChunk(chunk)
			return
		}
	} else if chunk+config.GetConfig().Ffmpeg.ChunkGap > ss.GetCurrentChunk() {
		ss.CONT()
	}
	// c.Header("Content-Type", "video/iso.segment")
	ss.SetLastRequestedChunk(chunk)
	c.Header("Content-Type", "video/mp4")
	c.File(safePath)
}
