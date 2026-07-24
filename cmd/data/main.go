package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"net/http"
	"os"
	"sort"
	"sync"
	"time"

	PTN "github.com/middelink/go-parse-torrent-name"
)

type Status string

const (
	Unknown Status = "multi"
	Tv      Status = "tv"
	Movies  Status = "movie"
)

type MovieResponse struct {
	Results [1]Movie `json:"results"`
}

type Movie struct {
	ID               int    `json:"id"`
	Title            string `json:"title"`
	Name             string `json:"name"`
	OriginalLanguage string `json:"original_language"`
	OriginalTitle    string `json:"original_title"`
	OriginalName     string `json:"original_name"`
}

// https://stackoverflow.com/questions/70339777/fetching-csv-data-using-golang
// https://stackoverflow.com/questions/50421449/golang-write-new-column-of-csv
func main() {
	err := godotenv.Load()
	ipf, err := os.Open("./stuff/Torrents.csv")
	if err != nil {
		fmt.Println(err)
	}

	defer ipf.Close()
	opf, err := os.Create("./stuff/orrents.csv")
	if err != nil {
		fmt.Println(err)
	}
	defer opf.Close()

	r := csv.NewReader(ipf)
	w := csv.NewWriter(opf)
	defer w.Flush()
	fields := make(map[string]int)
	header, err := r.Read()
	if err != nil {
		fmt.Println(err)
	}
	for i, name := range header {
		fields[name] = i
	}
	in, err := PTN.Parse("0.5.no.Otoko.EP01.1080p.AMZN.WEB-DL.DDP2.0.H.264-MagicStar.mkv")
	if err != nil {
		fmt.Println(err)
	}
	h, _ := get_header_and_values(in)
	h = append(h, []string{"title_name", "name_name", "id", "original_language", "original_title", "original_name"}...)
	header = append(header, h...)
	w.Write(header)

	fmt.Println(header)
	fmt.Println(in)
	fmt.Println("---------------------")
	var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, 10)
	for {
		// var status Status = Unknown
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(record[fields["name"]])
		sem <- struct{}{}
		wg.Add(1)
		go func(record []string) {
			defer func() { <-sem }()
			defer wg.Done()
			info, err := PTN.Parse(record[fields["name"]])
			// if info.Season != 0 || info.Episode != 0 {
			// 	status = Tv
			// }
			if err != nil {
				fmt.Println(err)
			}
			bytes, _ := json.Marshal(info)
			fmt.Println(string(bytes))
			_, v := get_header_and_values(info)
			// title := url.QueryEscape(info.Title)
			// taito := search_TMDB(title, status)
			// if status == Tv && taito[0] == "" && taito[1] == "" {
			// 	status = Unknown
			// 	taito = search_TMDB(title, status)
			// }
			// v = append(v, taito...)
			record = append(record, v...)
			// fmt.Println(strings.Join(taito, ","))
			mu.Lock()
			w.Write(record)
			mu.Unlock()
			fmt.Println("---------------------")
		}(record)
	}
	wg.Wait()
}

func search_TMDB(title string, status Status) []string {
	url := fmt.Sprintf("https://api.themoviedb.org/3/search/%s?query=%s&include_adult=true&page=1", status, title)
	client := &http.Client{Timeout: 10 * time.Second}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("accept", "application/json")
	TMDB_API_KEY := os.Getenv("TMDB_API_KEY")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", TMDB_API_KEY))
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	body, err := io.ReadAll(resp.Body)
	var response MovieResponse
	if err := json.Unmarshal(body, &response); err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()
	taito := response.Results[0]
	return []string{taito.Title, taito.Name, fmt.Sprint(taito.ID), taito.OriginalLanguage, taito.OriginalTitle, taito.OriginalName}

}

/*
NOTE: not that fun of a fact:
To permanently stop developers from relying on a map's order, the Go team made it explicitly random starting in Go 1.0.
Every time you start a range loop, Go picks a random memory bucket and a random offset to start from
*/
func get_header_and_values(info *PTN.TorrentInfo) ([]string, []string) {
	header := []string{}
	values := []string{}
	jinfo, err := json.Marshal(info)
	if err != nil {
	}
	var data map[string]any
	if err := json.Unmarshal(jinfo, &data); err != nil {
		fmt.Println(err)
		return nil, nil
	}
	keys := make([]string, 0, len(data))
	for k := range data {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, k := range keys {
		header = append(header, k)

		val := fmt.Sprintf("%v", data[k])
		if val == "<nil>" {
			val = ""
		}
		values = append(values, val)
	}

	return header, values
}

func create_header() {
	f, err := os.Open("./stuff/torrents.csv")
	if err != nil {
		fmt.Println(err)
	}
	defer f.Close()
	r := csv.NewReader(f)
	file, err := os.Create("./stuff/Torrents.csv")
	if err != nil {
		fmt.Println(err)
	}

	defer file.Close()
	writer := csv.NewWriter(file)

	defer writer.Flush()

	header := []string{
		"infohash",
		"name",
		"size_bytes",
		"created_unix",
		"seeders",
		"leechers",
		"completed",
		"scraped_date",
		"published",
	}
	if err := writer.Write(header); err != nil {
		return
	}
	records, err := r.ReadAll()
	for _, record := range records {
		if err := writer.Write(record); err != nil {
			fmt.Println("error")
		}

	}

}
