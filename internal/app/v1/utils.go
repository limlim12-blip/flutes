package v1

import (
	"lim/internal/db/repository"
	"lim/internal/errors"
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
