package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {
	url := fmt.Sprintf("https://api.themoviedb.org/3/%s/%d?language=%s&page=%d", params.Type, params.ID, query.Language, query.Page)

	if err != nil {
	    log.Printf("Error: %v", err)
	}
	;for
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatalf("Error creating request: %v", err)
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTk2ZGI3NGI1MDAwNmVhZjRiZmJkNWQ3YzFkOWExZiIsIm5iZiI6MTc4NDQ2Mzc4NC4yOTQwMDAxLCJzdWIiOiI2YTVjYzFhODkwYjljM2VmZjZkNzQzZWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j6_ZuLcIY4VLDfzVPPJBFXZ8W40W5VBbRl2bw2LjnQ0")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		// Exit early so 'res' is not nil when we try to use it
		log.Fatalf("Error making request: %v", err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatalf("Error reading response body: %v", err)
	}

	fmt.Println(string(body))
}
