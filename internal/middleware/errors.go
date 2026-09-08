package middleware

import (
	"github.com/gin-gonic/gin"
	"lim/internal/errors"
	"net/http"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			var Errors []string
			statusCode := http.StatusBadRequest
			for _, gErr := range c.Errors {
				if err, ok := gErr.Err.(*errors.ApiError); ok {
					Errors = append(Errors, err.Error())
					if err.HTTPCode > statusCode {
						statusCode = err.HTTPCode
					}
				} else {
					Errors = append(Errors, gErr.Err.Error())
					statusCode = http.StatusInternalServerError
				}
			}
			c.JSON(statusCode, gin.H{
				"Errors": Errors,
			})
		}
	}
}
