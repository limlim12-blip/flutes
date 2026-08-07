package v1

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
)

type Media struct {
	Mode    string `json:"mode"`
	Name    string `json:"name"`
	ModTime string `json:"modtime"`
	Size    int64  `json:"size"`
}
type MediaHandler struct {
	Handler *APIHandler
}

func (h *MediaHandler) RegisterRoutes() {
	courses := h.Handler.RouterGroup.Group("/media")
	courses.GET("", h.GetMedia)
}
func (h *MediaHandler) GetMedia(c *gin.Context) {
	entries, err := os.ReadDir("/app/stuff")
	if err != nil {
		log.Fatal(err)
	}
	var videos []Media
	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
			log.Printf("Error getting info for %s: %v", entry.Name(), err)
			continue
		}

		v := Media{
			Mode:    string(info.Mode().String()),
			Name:    string(entry.Name()),
			ModTime: info.ModTime().Format("2006-01-02 15:04"),
			Size:    info.Size(),
		}
		videos = append(videos, v)
	}
	c.JSON(http.StatusOK, videos)

}
