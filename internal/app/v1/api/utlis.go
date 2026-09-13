package api

import (
	"errors"
	"fmt"
	"io"
	"lim/internal/config"
	. "lim/pkg/logger"
	. "lim/pkg/storage"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/anacrolix/torrent"
	"golang.org/x/time/rate"
)

var errSeeker = errors.New("seeker can't seek")

func sizeFunc(content io.ReadSeeker) (int64, error) {
	size, err := content.Seek(0, io.SeekEnd)
	if err != nil {
		return 0, errSeeker
	}
	_, err = content.Seek(0, io.SeekStart)
	if err != nil {
		return 0, errSeeker
	}
	return size, nil
}
func ServeContent(w http.ResponseWriter, req *http.Request, name string, modtime time.Time, content io.ReadSeeker) {
	setLastModified(w, modtime)
}

func isZeroTime(t time.Time) bool {
	return t.IsZero() || t.Equal(time.Unix(0, 0))
}

const TimeFormat = "Mon, 02 Jan 2006 15:04:05 GMT"

func setLastModified(w http.ResponseWriter, modtime time.Time) {
	if !isZeroTime(modtime) {
		w.Header().Set("Last-Modified", modtime.UTC().Format(TimeFormat))
	}
}
func GetVideoDuration(filePath string) (string, error) {
	cmd := exec.Command("ffprobe",
		"-v", "error",
		"-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1",
		filePath,
	)
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("ffprobe failed: %v", err)
	}
	secStr := string(out)
	secStr = regexp.MustCompile(`\s+`).ReplaceAllString(secStr, "")
	return fmt.Sprintf("PT%sS", secStr), nil
}
func NewClient() *torrent.Client {
	basePort := getBasePort()
	maxMem := config.GetConfig().TorrentConf.MaxMemClient
	cc := torrent.NewDefaultClientConfig()
	cc.TotalHalfOpenConns = 200
	cc.DialRateLimiter = rate.NewLimiter(400, 600)
	cc.HalfOpenConnsPerTorrent = 10
	cc.EstablishedConnsPerTorrent = 10
	cc.NominalDialTimeout = 15 * time.Second
	cc.MinDialTimeout = 5 * time.Second
	cc.NoUpload = true
	cc.DisableUTP = true
	cc.DisableTCP = false
	cc.ListenPort = basePort
	cc.DefaultStorage = NewTorStorage(int64(maxMem))
	c, err := torrent.NewClient(cc)
	if err != nil {
		Sugar.Fatalw("failed to initialize streaming tor client", "error", err)
	}
	return c
}
func getBasePort() (port int) {
	data, err := os.ReadFile("/tmp/gluetun/forwarded_port")
	if err != nil {
		Sugar.Warnw("tor streaming client failed to read forwarded port, using default",
			"error", err,
			"default_port", port,
		)
	} else {
		portStr := strings.TrimSpace(string(data))
		if p, err := strconv.Atoi(portStr); err == nil && p > 0 {
			port = p
		}
	}
	return port
}
