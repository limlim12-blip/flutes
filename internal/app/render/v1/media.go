package v1

import (
	"lim/template"
	"net/http"

	"github.com/gin-gonic/gin"
	tmpl "lim/pkg/gintemplrenderer"
)

type MediaHandler struct {
	handler Handler
}

func InitMetaHandler() MediaHandler {
	return MediaHandler{}
}
func (h *MediaHandler) RegisterRoutes() {
	router := h.handler.RouterGroup.Group("/media")
	router.GET("/", h.GetHome)

}
func (h *MediaHandler) GetHome(c *gin.Context) {
	tmpl.Render(c, http.StatusOK, template.Show())
}
