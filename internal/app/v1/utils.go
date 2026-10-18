package v1

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"lim/internal/config"
	"lim/internal/db/repository"
	"lim/internal/errors"
	"lim/pkg/broker"
	. "lim/pkg/logger"
	"lim/pkg/utils"
	"math"
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
	ssid          uuid.UUID
	encodeName    [32]byte
	isThrottled   bool
	isAddedMagnet bool
	isPaused      bool

	cmd                *exec.Cmd
	currentChunk       int64
	lastRequestedChunk int64
	lastActiveTime     int64
	SeekChunk          int64

	client  *torrent.Client
	tor     *torrent.Torrent
	torfile *torrent.File

	SessionPath string
	SegmentPath string
	// Media
	duration  float64
	width     int16
	height    int16
	size      int64
	container string
	manifest  []byte

	ctx    context.Context
	cancel context.CancelFunc

	magnetUrl string
	inputUrl  url.URL
	outputUrl url.URL
}

func (s *TranscodeSession) GetLastActiveTime() int64 {
	return s.lastActiveTime
}

func (s *TranscodeSession) SetLastActiveTime(Atime int64) {
	s.lastActiveTime = Atime
}
func (s *TranscodeSession) GetLastRequestedChunk() int64 {
	return s.lastRequestedChunk
}
func (s *TranscodeSession) SetLastRequestedChunk(lastRequestedChunk int64) {
	s.lastRequestedChunk = lastRequestedChunk
}
func (s *TranscodeSession) SetCurrentChunk(currentChunk int64) {
	s.currentChunk = currentChunk
}
func (s *TranscodeSession) GetCurrentChunk() int64 {
	return s.currentChunk
}
func NewSession(hash, file string, seekTime float64, Client *torrent.Client) (*TranscodeSession, error) {
	//ssid
	data := fmt.Sprintf("%s:%s", hash, file)
	encodeName := sha256.Sum256([]byte(data))
	cwd, _ := os.Getwd()
	ssid := uuid.New()
	ssid_string := ssid.String()
	sessionDir := filepath.Join(cwd, "tmp", "sessions", ssid_string, "encode_name", hex.EncodeToString(encodeName[:]))

	//input
	port := config.GetConfig().HTTP.Port
	os.MkdirAll(sessionDir, 0755)
	inputUrl := &url.URL{
		Scheme: "http",
		Host:   fmt.Sprintf("localhost:%d", port),
		Path:   fmt.Sprintf("api/v1/video/session/%s/hash/%s/stream", ssid_string, hash),
	}
	iparams := url.Values{}
	iparams.Set("filepath", file)
	inputUrl.RawQuery = iparams.Encode()

	//output
	outputUrl := &url.URL{
		Scheme: "http",
		// Change %s to %d
		Host: fmt.Sprintf("localhost:%d", port),
		Path: fmt.Sprintf("api/v1/internal/session/%s/transcode_stats", ssid_string),
	}
	oparams := url.Values{}
	oparams.Add("session", ssid_string)
	outputUrl.RawQuery = oparams.Encode()

	ss := &TranscodeSession{
		ssid:        ssid,
		encodeName:  encodeName,
		client:      Client,
		SessionPath: sessionDir,
		inputUrl:    *inputUrl,
		outputUrl:   *outputUrl,
	}
	fmt.Print("new session")
	return ss, ss.SetCmd(1)
}
func (s *TranscodeSession) GetID() uuid.UUID { return s.ssid }
func (s *TranscodeSession) SetCmd(chunk int64) error {
	Sugar.Debugw("SETCMD")
	if s.cancel != nil {
		s.cancel()
		if s.cmd != nil {
			_ = s.cmd.Wait()
		}
	}
	if chunk > int64(s.duration/10)+1 {
		return errors.NewBadRequest("chunk toooo large", nil)
	}

	seekTime := (chunk - 1) * config.GetConfig().Ffmpeg.ChunkDuration
	mpdPath := filepath.Join(s.GetMpdPath(), "manifest.m3u8")

	segmentPath := filepath.Join(s.GetMpdPath(), "chunk_%05d.mp4")
	s.SegmentPath = segmentPath
	ctx, cancel := context.WithCancel(context.Background())
	cmd := exec.CommandContext(
		ctx,
		"nice", "-n", "19",
		"ffmpeg",
		"-stats_period", "2",
		"-threads", "1",
		"-copyts",
		"-ss", strconv.FormatInt(seekTime, 10),
		"-i", s.inputUrl.String(),
		"-pix_fmt", "yuv420p",
		"-preset", "ultrafast",
		"-map", "0:a:0", "-c:a", "aac",
		"-map", "0:v:0", "-c:v", "libx264",
		"-sn",
		"-map_metadata", "-1",
		"-force_key_frames", "expr:gte(t,n_forced*10)",
		"-muxdelay", "0",
		"-progress", s.outputUrl.String(),

		"-f", "hls",
		"-hls_time", strconv.FormatFloat(10.0, 'f', 0, 64),
		"-hls_segment_type", "fmp4",
		"-hls_list_size", "0",
		"-start_number", strconv.FormatInt(chunk, 10),
		"-hls_fmp4_init_filename", "init.mp4",
		"-hls_segment_filename", s.SegmentPath,
		"-hls_flags", "independent_segments+temp_file",

		mpdPath,
	)

	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout
	s.cmd = cmd
	s.cancel = cancel
	s.ctx = ctx
	s.SeekChunk = chunk
	s.SetCurrentChunk(chunk)
	return nil
}

var trackers string = utils.GetTracker()

func (s *TranscodeSession) GetReader(c context.Context, infohash, target string) (torrent.Reader, error) {
	if s.isAddedMagnet {
		return s.torfile.NewReader(), nil
	}
	magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", infohash, trackers)

	Sugar.Debugw("adding magnet to tor video client", "infohash", infohash)
	var err error
	s.tor, err = s.client.AddMagnet(magnetLink)
	if err != nil {
		return nil, errors.NewInternal("failed to add magnet to tor video client", err)
	}

	Sugar.Debugw("waiting for torrent metadata...", "infohash", infohash)

	select {
	case <-s.tor.GotInfo():
		Sugar.Debugw("metadata resolved", "infohash", infohash, "torrent_name", s.tor.Name())
		s.isAddedMagnet = true
	case <-c.Done():
		s.tor.Drop()
		return nil, errors.NewInternal("client disconnected before metadata", c.Err())
	case <-time.After(30 * time.Second):
		s.tor.Drop()
		return nil, errors.NewInternal("timeout: could not find torrent metadata", nil)
	}

	var targetFile *torrent.File
	for _, file := range s.tor.Files() {
		//TODO: do smth with this
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
		s.tor.Drop()
		return nil, errors.NewBadRequest(fmt.Sprintf("no file matching '%s' found in torrent", target), nil)
	}

	reader := targetFile.NewReader()
	reader.SetResponsive()
	s.torfile = targetFile
	return reader, nil
}

func (s *TranscodeSession) CONT() error {
	Sugar.Debugw("CONT")
	if s.cmd == nil {
		return fmt.Errorf("error cont ffmpeg: session %s not have cmd", s.ssid)
	}
	if s.cmd.Process != nil {
		return s.cmd.Process.Signal(syscall.SIGCONT)
	}
	if s.manifest == nil {
		if err := s.GetMetaData(); err != nil {
			return err
		}
	}
	return s.cmd.Start()
}

func (s *TranscodeSession) STOP() error {
	if s.cmd == nil {
		return fmt.Errorf("error stop ffmpeg: session %s not have cmd", s.ssid)
	}

	if s.cmd != nil && s.cmd.Process != nil {
		return s.cmd.Process.Signal(syscall.SIGSTOP)
	}
	return fmt.Errorf("error stop ffmpeg: session %s not yet start", s.ssid)
}

func (s *TranscodeSession) GetTorDisplayPath() string {
	if s.torfile == nil {
		return ""
	}
	return s.torfile.DisplayPath()
}
func (s *TranscodeSession) GetMpdPath() string {
	return s.SessionPath
}

func (s *TranscodeSession) IsAddedMagnet() bool {
	return s.isAddedMagnet
}

func (s *TranscodeSession) GetMetaData() error {
	var metaData MetaData
	cmd := exec.CommandContext(
		s.ctx,
		"nice", "-n", "19",
		//ffprobe -v quiet  json -show_format -show_streams -show_chapters -show_programs -show_packets -show_frames input.mp4 > complete_metadata.json
		"ffprobe",
		"-v", "quiet",
		"-print_format", "json",
		"-show_format",
		"-show_streams",
		s.inputUrl.String(),
	)
	cmd.Stderr = os.Stderr

	outPut, err := cmd.Output()
	if err != nil {
		return errors.NewInternal(fmt.Sprintf("error probing video %s", &s.inputUrl), err)
	}
	err = json.Unmarshal(outPut, &metaData)
	if err != nil {
		return errors.NewInternal(fmt.Sprintf("error Unmarshal video metadata %s", &s.inputUrl), err)
	}
	for _, stream := range metaData.Streams {
		if stream.CodecType == "video" && stream.Disposition["default"] == 1 {
			s.width = int16(stream.Width)
			s.height = int16(stream.Height)
		}
	}

	duration, err := strconv.ParseFloat(metaData.Format.Duration, 64)
	if err != nil {
		return errors.NewInternal(fmt.Sprintf("error video duration %s", &s.inputUrl), err)
	}
	sb := []byte(strings.Join([]string{
		"#EXTM3U",
		"#EXT-X-VERSION:7",
		"#EXT-X-TARGETDURATION:10",
		"#EXT-X-PLAYLIST-TYPE:VOD",
		"#EXT-X-MEDIA-SEQUENCE:1",
		"#EXT-X-INDEPENDENT-SEGMENTS",
		"#EXT-X-MAP:URI=\"init.mp4\"\n",
	}, "\n"))
	for i := range int64(duration) / config.Duration {
		chunk := []byte(fmt.Sprintf("#EXTINF:10.000000,\nchunk_%05d.mp4\n", i+1))
		sb = append(sb, chunk...)
	}
	if math.Mod(duration, float64(config.Duration)) != 0 {
		chunk := []byte(fmt.Sprintf(
			"#EXTINF: %.6f,\nchunk_%05d.mp4\n",
			math.Mod(duration, float64(config.Duration)), int64(duration)/config.Duration+1,
		))
		sb = append(sb, chunk...)
	}
	sb = append(sb, []byte("#EXT-X-ENDLIST")...)

	s.duration = duration
	s.size = metaData.Format.Size
	s.container = metaData.Format.FormatName
	s.manifest = sb
	Sugar.Debugw("manifest inspect", "manifest", string(sb))
	return nil
}

func (s *TranscodeSession) GetManifest() []byte {
	return s.manifest

}

type MetaData struct {
	Streams []Stream `json:"streams"`
	Format  Format   `json:"format"`
}

type Stream struct {
	Index            int    `json:"index"`
	CodecName        string `json:"codec_name,omitempty"`
	CodecLongName    string `json:"codec_long_name,omitempty"`
	Profile          string `json:"profile,omitempty"`
	CodecType        string `json:"codec_type"` // e.g., "video", "audio"
	CodecTagString   string `json:"codec_tag_string,omitempty"`
	CodecTag         string `json:"codec_tag,omitempty"`
	Width            int    `json:"width,omitempty"`
	Height           int    `json:"height,omitempty"`
	CodedWidth       int    `json:"coded_width,omitempty"`
	CodedHeight      int    `json:"coded_height,omitempty"`
	ClosedCaptions   int    `json:"closed_captions,omitempty"`
	PixFmt           string `json:"pix_fmt,omitempty"`
	Level            int    `json:"level,omitempty"`
	ColorRange       string `json:"color_range,omitempty"`
	ColorSpace       string `json:"color_space,omitempty"`
	RFrameRate       string `json:"r_frame_rate,omitempty"`
	AvgFrameRate     string `json:"avg_frame_rate,omitempty"`
	TimeBase         string `json:"time_base,omitempty"`
	StartPts         int64  `json:"start_pts,omitempty"`
	StartTime        string `json:"start_time,omitempty"`
	DurationTs       int64  `json:"duration_ts,omitempty"`
	Duration         string `json:"duration,omitempty"`
	BitRate          string `json:"bit_rate,omitempty"`
	BitsPerRawSample string `json:"bits_per_raw_sample,omitempty"`
	NbFrames         string `json:"nb_frames,omitempty"`

	// Audio-specific fields
	SampleRate    string `json:"sample_rate,omitempty"`
	Channels      int    `json:"channels,omitempty"`
	ChannelLayout string `json:"channel_layout,omitempty"`
	BitsPerSample int    `json:"bits_per_sample,omitempty"`

	Disposition map[string]int    `json:"disposition,omitempty"`
	Tags        map[string]string `json:"tags,omitempty"`
}

type Format struct {
	Filename       string            `json:"filename"`
	NbStreams      int               `json:"nb_streams"`
	NbPrograms     int               `json:"nb_programs"`
	FormatName     string            `json:"format_name"`
	FormatLongName string            `json:"format_long_name"`
	StartTime      string            `json:"start_time,omitempty"`
	Duration       string            `json:"duration,omitempty"`
	Size           int64             `json:"size,string,omitempty"`
	BitRate        int64             `json:"bit_rate,string,omitempty"`
	ProbeScore     int               `json:"probe_score"`
	Tags           map[string]string `json:"tags,omitempty"`
}
