package v1

import (
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func (h *APIHandler) GetVideoChunk(c *gin.Context) {
	// filePath := "/app/stuff/output.mp4"
	filePath := c.Param("path")
	fullPath := filepath.Join("./stuff", filePath)

	c.File(fullPath)
}
