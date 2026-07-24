package main

import (
	"lim/routers"
	"log"
	"net/http"
)

func main() {
	routersInit := routers.InitRouter()
	endPoint := ":8080"
	server := &http.Server{
		Addr:    endPoint,
		Handler: routersInit,
	}

	log.Printf("[info] start http server listening %s", endPoint)
	server.ListenAndServe()
}
