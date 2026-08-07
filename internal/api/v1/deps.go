package v1

import (
	"github.com/gin-gonic/gin"
)

type APIHandler struct {
	RouterGroup gin.IRouter
}

func NewAPIHandler(r gin.IRouter) *APIHandler {
	return &APIHandler{RouterGroup: r}
}
