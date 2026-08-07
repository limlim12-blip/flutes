package main

import (
	"lim/internal/api"
	"log"
	"net/http"
)

func main() {
	routersInit := api.InitRouter()
	endPoint := ":8080"
	server := &http.Server{
		Addr:    endPoint,
		Handler: routersInit,
	}

	log.Printf("[info] start http server listening %s", endPoint)
	server.ListenAndServe()
}
