package v1

import (
	"lim/db/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIHandler struct {
	RouterGroup gin.IRouter
	Repository  *repository.Queries
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
