package api

import (
	"bufio"
	. "lim/pkg/logger"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	. "lim/internal/app/v1"
	"lim/internal/config"
	"lim/internal/errors"
)

type InternalRouter struct {
	*Handler
}

func InitInternalRouter(router string, hand *Handler) {
	m := InternalRouter{hand}
	m.RegisterRoutes(router)

}
func (s *InternalRouter) RegisterRoutes(group string) {
	courses := s.Engine.Group(group)
	courses.POST("/session/:session/transcode_stats", s.HandleTranscodeStats)
}

func (s *InternalRouter) HandleTranscodeStats(c *gin.Context) {
	sessionKey := c.Param("session")

	ssid, err := uuid.Parse(sessionKey)
	if err != nil {
		c.Error(errors.NewBadRequest("invalid session uuid", err))
		return
	}
	ss, exists := (*s.TranscodeSessions)[ssid]
	if !exists {
		c.Error(errors.NewBadRequest("session does not exist", nil))
		return
	}

	// Use a scanner to read streaming lines from FFmpeg's HTTP POST body
	scanner := bufio.NewScanner(c.Request.Body)
	for scanner.Scan() {
		line := scanner.Text()
		data := strings.SplitN(line, "=", 2)
		if len(data) != 2 {
			continue
		}

		key := strings.TrimSpace(data[0])
		val := strings.TrimSpace(data[1])

		Sugar.Debugw("field", "key", key, "val", val)
		if key == "out_time_us" {
			us, err := strconv.ParseInt(val, 10, 64)
			if err != nil || us < 0 {
				continue
			}

			chunk := int64(us/10000000) + ss.SeekChunk

			Sugar.Debugw("field", "chunk", chunk, "cur_chunk", ss.GetLastRequestedChunk()+config.GetConfig().Ffmpeg.ChunkGap)
			if chunk > ss.GetLastRequestedChunk()+config.GetConfig().Ffmpeg.ChunkGap {
				Sugar.Debugw("ss stop")
				ss.STOP()
				break
			}
			ss.SetCurrentChunk(chunk)
		}
	}

	c.Status(http.StatusOK)
}

//TODO state of the session -> hadnle stop/cont 	// 10000000 = 1s
// frame=35308
// fps=105.40
// stream_0_0_q=28.0
// bitrate=2194.6kbits/s
// total_size=403963952
// out_time_us=1472554417 -> us = ms microseconds = milliseconds :D
// out_time_ms=1472554417
// out_time=00:24:32.554417
// dup_frames=0
// drop_frames=0
// speed= 4.4x
// progress=continue
