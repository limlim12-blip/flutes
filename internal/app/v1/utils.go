package v1

import (
	"context"
	"fmt"
	"lim/internal/config"
	"lim/internal/db/repository"
	"lim/internal/errors"
	"lim/pkg/broker"
	. "lim/pkg/logger"
	"lim/pkg/utils"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"

	"github.com/a-h/templ"
	"github.com/anacrolix/torrent"
	"github.com/angelofallars/htmx-go"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Broker            *broker.Broker
	Repository        *repository.Queries
	Rdb               *redis.Client
	Engine            *gin.Engine
	TranscodeSessions *map[uuid.UUID]*TranscodeSession
	Client            *torrent.Client
	Repo              *repository.Queries
}

func BindAndValidateParams(c *gin.Context, uriObj any, queryObj any, headerObj any) *errors.ApiError {
	if uriObj != nil {
		if err := c.ShouldBindUri(uriObj); err != nil {
			return errors.NewBadRequest("URI validation failed", err)
		}
	}
	if queryObj != nil {
		if err := c.ShouldBindQuery(queryObj); err != nil {
			return errors.NewBadRequest("Queries validation failed", err)
		}
	}
	if headerObj != nil {
		if err := c.ShouldBindHeader(headerObj); err != nil {
			return errors.NewBadRequest("headers validation failed", err)
		}
	}
	return nil
}
func HtmxRender(c *gin.Context, template templ.Component) {
	if err := htmx.NewResponse().RenderTempl(c.Request.Context(), c.Writer, template); err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

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
	Tor                *torrent.Torrent
	Torfile            *torrent.File
	Path               string
}

func NewSession(hash, file string, seekTime float64, sessionKey uuid.UUID, Client *torrent.Client) *TranscodeSession {
	cwd, _ := os.Getwd()
	sessionID := sessionKey.String()
	port := config.GetConfig().HTTP.Port

	sessionDir := filepath.Join(cwd, "tmp", "sessions", sessionID)
	os.MkdirAll(sessionDir, 0755)
	mpdPath := filepath.Join(sessionDir, "manifest.mpd")

	inputUrl := &url.URL{
		Scheme: "http",
		// Change %s to %d
		Host: fmt.Sprintf("localhost:%d", port),
		Path: fmt.Sprintf("api/v1/video/session/%s/hash/%s/stream", sessionID, hash),
	}
	iparams := url.Values{}
	iparams.Set("filepath", file)
	inputUrl.RawQuery = iparams.Encode()

	outputUrl := &url.URL{
		Scheme: "http",
		// Change %s to %d
		Host: fmt.Sprintf("localhost:%d", port),
		Path: "api/v1/internal/transcode_stats",
	}

	cmd := SetCmd(*inputUrl, *outputUrl, seekTime, mpdPath)
	return &TranscodeSession{
		Cmd:       cmd,
		OutputDir: sessionDir,
		Id:        sessionKey,
		Client:    Client,
		Path:      sessionDir,
	}
}
func SetCmd(inputUrl, outputUrl url.URL, seekTime float64, mpdPath string) *exec.Cmd {
	//TODO: try gpu -> less versatile but faster
	// 0 idea how this work
	cmd := exec.Command(
		"nice", "-n", "19",
		"ffmpeg",

		"-reconnect", "1",
		"-reconnect_streamed", "1",
		"-reconnect_delay_max", "5",
		"-rw_timeout", "30000000",

		"-ss", strconv.FormatFloat(seekTime, 'f', 2, 64),
		"-threads", "2",
		"-i", inputUrl.String(),

		"-analyzeduration", "10000000",
		"-probesize", "10000000",

		"-c:v", "libx264",
		"-pix_fmt", "yuv420p",
		"-preset", "ultrafast",
		"-crf", "28",
		"-c:a", "aac",
		"-b:a", "128k",

		"-f", "dash",
		"-seg_duration", strconv.Itoa(config.Duration),
		"-force_key_frames", fmt.Sprintf("expr:gte(t,n_forced*%d)", config.Duration),
		"-use_template", "1",
		"-use_timeline", "0",
		"-init_seg_name", "init_$RepresentationID$.m4s",
		"-media_seg_name", "chunk_$RepresentationID$_$Number$.m4s",
		"-window_size", "0",
		"-progress", outputUrl.String(),
		mpdPath,
	)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd

}

var Trackers string = utils.GetTracker()

func (s *TranscodeSession) GetReader(c context.Context, infohash, target string) (torrent.Reader, error) {
	if s.addedMagnet {
		return s.Torfile.NewReader(), fmt.Errorf("each session only have one magnet")
	}

	magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", infohash, Trackers)

	Sugar.Debugw("adding magnet to tor video client", "infohash", infohash)
	var err error
	s.Tor, err = s.Client.AddMagnet(magnetLink)
	if err != nil {
		return nil, errors.NewInternal("failed to add magnet to tor video client", err)
	}

	Sugar.Debugw("waiting for torrent metadata...", "infohash", infohash)

	select {
	case <-s.Tor.GotInfo():
		Sugar.Debugw("metadata resolved", "infohash", infohash, "torrent_name", s.Tor.Name())
	case <-c.Done():
		s.Tor.Drop()
		return nil, errors.NewInternal("client disconnected before metadata", c.Err())
	case <-time.After(30 * time.Second):
		s.Tor.Drop()
		return nil, errors.NewInternal("timeout: could not find torrent metadata", nil)
	}

	var targetFile *torrent.File
	for _, file := range s.Tor.Files() {
		if target != "" {
			if file.DisplayPath() == target {
				targetFile = file
				break
			}
		} else {
			if strings.HasSuffix(strings.ToLower(file.DisplayPath()), ".mp4") || strings.HasSuffix(strings.ToLower(file.DisplayPath()), ".mkv") {
				targetFile = file
				break
			}
		}
	}

	if targetFile == nil {
		s.Tor.Drop()
		return nil, errors.NewBadRequest(fmt.Sprintf("no file matching '%s' found in torrent", target), nil)
	}

	reader := targetFile.NewReader()
	reader.SetResponsive()
	s.Torfile = targetFile
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
