package api

import (
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	. "lim/internal/app/v1"
)

var (
	ActiveSessions = make(map[string]*TranscodeSession)
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
	courses.POST("/transcode_stats", HandleTranscodeStats)
}

func HandleTranscodeStats(c *gin.Context) {
	sessionKey := c.Query("session")

	session, exists := ActiveSessions[sessionKey]

	if !exists || session == nil || session.Cmd == nil {
		c.String(http.StatusOK, "Ignored")
		return
	}

	body, _ := io.ReadAll(c.Request.Body)
	fields := strings.Split(string(body), "\n")
	var state = make(map[string]string)

	for _, field := range fields {
		data := strings.SplitN(string(field), "=", 2)
		if len(data) == 2 {
			state[strings.TrimSpace(data[0])] = strings.TrimSpace(data[1])
		}
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
}
