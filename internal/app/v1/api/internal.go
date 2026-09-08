package api

import (
	"context"
	"fmt"
	"io"
	. "lim/pkg/logger"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	. "lim/internal/app/v1"
	"lim/internal/config"
	"lim/internal/errors"
)

var (
	ActiveSessions = make(map[string]*TranscodeSession)
)

type InternalRouter struct {
	*APIRouter
}

func (s *InternalRouter) RegisterRoutes(group string) {
	courses := s.APIRouter.Engine.Group(group)
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

type TranscodeSession struct {
	//TODO: loop through -> check time -> delete or chanel -> timer -> sent kill
	Cmd                *exec.Cmd
	OutputDir          string
	IsThrottled        bool
	Id                 uuid.UUID
	Width              int
	Height             int
	TimeStamp          time.Time
	LastRequestedChunk int64
	Duration           int64
	Remaining          int64
	Client             *torrent.Client
	addedMagnet        bool
	tor                *torrent.Torrent
	torfile            *torrent.File
}

func NewSession(hash, file string, sessionKey uuid.UUID, Client *torrent.Client) *TranscodeSession {
	cwd, _ := os.Getwd()
	sessionDir := filepath.Join(cwd, "tmp", hash)
	os.MkdirAll(sessionDir, 0755)

	mpdPath := filepath.Join(sessionDir, "manifest.mpd")
	id := uuid.New()
	port := config.GetConfig().HTTP.Port
	sessionID := sessionKey.String()
	inputURL := fmt.Sprintf(
		"http://localhost:%d/session/%s/hash/%s/filepath/%s",
		port,
		sessionID,
		hash,
		file,
	)
	progressURL := fmt.Sprintf(
		"http://localhost:%d/internal/transcode_stats?session=%s",
		config.GetConfig().HTTP.Port,
		sessionKey.String(),
	)

	cmd := exec.Command(
		"nice", "-n", "19",
		"ffmpeg",
		"-threads", "2",
		// "-rw_timeout", "5000000",
		"-i", inputURL,
		"-analyzeduration", "10000000",
		"-probesize", "10000000",
		"-c:v", "libx264",
		"-pix_fmt", "yuv420p",
		"-preset", "ultrafast",
		"-crf", "28",
		"-c:a", "aac",
		"-b:a", "128k",
		"-f", "dash",
		"-seg_duration", "10",
		"-use_template", "1",
		"-use_timeline", "0",
		"-init_seg_name", "init_$RepresentationID$.m4s",
		"-media_seg_name", "chunk_$RepresentationID$_$Number$.m4s",
		"-window_size", "0",
		"-progress", progressURL,
		mpdPath,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return &TranscodeSession{
		Cmd:       cmd,
		OutputDir: sessionDir,
		Id:        id,
		Client:    Client,
	}
}

func (s *TranscodeSession) GetReader(c context.Context, infohash, target string) (torrent.Reader, error) {
	if s.addedMagnet {
		return s.torfile.NewReader(), fmt.Errorf("each session only have one magnet")
	}
	magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", infohash, Trackers)
	target, err := url.QueryUnescape(target)
	if err != nil {
		return nil, errors.NewInternal("failed to add decode file query", err)
	}
	Sugar.Debugw("adding magnet to tor video client", "infohash", infohash)
	s.tor, err = s.Client.AddMagnet(magnetLink)
	if err != nil {
		return nil, errors.NewInternal("failed to add magnet to tor video client", err)
	}
	Sugar.Debugw("waiting for torrent metadata...", "infohash", infohash)

	select {
	case <-s.tor.GotInfo():
		Sugar.Debugw("metadata resolved", "infohash", infohash, "torrent_name", s.tor.Name())
	case <-c.Done():
		s.tor.Drop()
		return nil, errors.NewInternal("client disconnected before metadata", c.Err())
	case <-time.After(30 * time.Second):
		s.tor.Drop()
		return nil, errors.NewInternal("timeout: could not find torrent metadata (no seeders?)", nil)
	}
	var targetFile *torrent.File
	//TODO: fix this
	for _, file := range s.tor.Files() {
		if target != "" {
			if file.DisplayPath() == target {
				targetFile = file
				break
			}
		} else {
			if strings.HasSuffix(strings.ToLower(file.DisplayPath()), ".mp4") {
				targetFile = file
				break
			}
		}
	}
	if targetFile == nil {
		s.tor.Drop()
		return nil, errors.NewBadRequest(fmt.Sprintf("no file matching '%s' found in torrent - infohasn: %s - name: '%s' ", target, infohash, s.tor.Name()), nil)
	}
	// no defer drop, need to serve
	reader := targetFile.NewReader()
	reader.SetResponsive()
	s.torfile = targetFile
	return reader, nil
}

func (s *TranscodeSession) CONT() error {
	if s.Cmd != nil && s.Cmd.Process != nil {
		return s.Cmd.Process.Signal(syscall.SIGCONT)
	}
	return nil
}

func (s *TranscodeSession) STOP() error {
	if s.Cmd != nil && s.Cmd.Process != nil {
		return s.Cmd.Process.Signal(syscall.SIGSTOP)
	}
	return nil
}
