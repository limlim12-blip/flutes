package render

import (
	"net/http"
	"net/url"
	"time"

	. "lim/internal/app/v1"
	"lim/templates/pages"

	"github.com/anacrolix/torrent"
	"github.com/gin-gonic/gin"
	// "github.com/anacrolix/torrent" -> Import your torrent library here
)

type TorrentHandler struct {
	TorrentClient *torrent.Client
}

func NewTorrentHandler() *TorrentHandler {
	return &TorrentHandler{}
}

// StreamTorrent handles taking a magnet link and proxying the video stream to the HTML5 video player
func (h *TorrentHandler) StreamTorrent(c *gin.Context) {
	magnetLink := c.Query("magnet")
	if magnetLink == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'magnet' query parameter"})
		return
	}

	// 1. Decode the magnet link just in case it came URL-encoded from the frontend
	decodedMagnet, err := url.QueryUnescape(magnetLink)
	if err != nil {
		decodedMagnet = magnetLink
	}

	t, err := h.TorrentClient.AddMagnet(decodedMagnet)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse magnet link"})
		return
	}
	<-t.GotInfo() // Wait for metadata resolution

	var targetFile *torrent.File
	for _, file := range t.Files() {
		targetFile = file
	}

	targetFile.Download() // Ensure sequential prioritization
	reader := targetFile.NewReader()
	defer reader.Close()

	http.ServeContent(c.Writer, c.Request, targetFile.DisplayPath(), time.Now(), reader)

	c.JSON(http.StatusOK, gin.H{
		"status": "ready to stream",
		"magnet": decodedMagnet,
	})
}

// RenderStreamTestPage renders the test frontend template we built earlier
func (h *TorrentHandler) RenderStreamTestPage(c *gin.Context) {
	streamURL := "/api/torrent/stream?magnet=magnet%3A%3D..."

	if c.GetHeader("HX-Request") == "true" {
		HtmxRender(c, pages.VideoPlayer(streamURL))
		return
	}

}
