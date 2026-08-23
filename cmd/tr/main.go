package main

import (
	. "lim/internal/crawler"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/gin-gonic/gin"
)

func StreamTorrent(magnetLink string, TorrentClient *torrent.Client) *torrent.File {
	decodedMagnet, err := url.QueryUnescape(magnetLink)
	if err != nil {
		decodedMagnet = magnetLink
	}

	t, err := TorrentClient.AddMagnet(decodedMagnet)
	if err != nil {
		return nil
	}
	<-t.GotInfo()
	var targetFile *torrent.File
	for _, file := range t.Files() {
		// Find your target media file (e.g., .mp4 or .mkv)
		targetFile = file
		break
	}

	if targetFile == nil {
		return nil
	}
	return targetFile
}
func main() {
	cc := torrent.NewDefaultClientConfig()
	cacheDir := "./tor"
	os.MkdirAll(cacheDir, 0755)

	cc.DefaultStorage = &EmptyStorage{BaseDir: cacheDir, List: new(SafeList).Init(), MaxMem: 2 * 1024 * 1024 * 1024}
	c, err := torrent.NewClient(cc)
	if err != nil {
		log.Printf("Error: %v", err)
	}

	file := StreamTorrent("magnet:?xt=urn:btih:abf093fed9cc32bb036d38b23ebd2e1b017b6caf&dn=Japanese%20Drama%20Collection%200-G&xl=330037734578&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce", c)

	r := gin.Default()

	r.LoadHTMLGlob("template/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "video.html", gin.H{
			"VideoUrl": "/stream-video",
		})
	})

	r.GET("/stream-video", func(c *gin.Context) {
		log.Printf("%v", file.DisplayPath())
		reader := file.NewReader()
		defer reader.Close()
		reader.SetResponsive()
		http.ServeContent(c.Writer, c.Request, file.DisplayPath(), time.Now(), reader)
	})

	r.Run(":8080")
}
