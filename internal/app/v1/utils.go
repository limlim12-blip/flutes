package v1

import (
	"lim/db/repository"
	"net/http"

	"github.com/a-h/templ"
	"github.com/angelofallars/htmx-go"
	"github.com/gin-gonic/gin"
)

type APIRouter struct {
	Engine     *gin.Engine
	Repository *repository.Queries
}

type Handler struct {
	Engine *gin.Engine
}

func BindAndValidateParams(c *gin.Context, uriObj any, queryObj any, headerObj any) bool {
	if uriObj != nil {
		if err := c.ShouldBindUri(uriObj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "URI validation failed: " + err.Error()})
			return false
		}
	}
	if queryObj != nil {
		if err := c.ShouldBindQuery(queryObj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Query validation failed: " + err.Error()})
			return false
		}
	}
	if headerObj != nil {
		if err := c.ShouldBindHeader(headerObj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Header validation failed: " + err.Error()})
			return false
		}
	}
	return true
}
func HtmxRender(c *gin.Context, template templ.Component) {
	if err := htmx.NewResponse().RenderTempl(c.Request.Context(), c.Writer, template); err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

}
