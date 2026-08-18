package main

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	_ "github.com/lib/pq"

	"log"
	"net/http"
	"os"
	"sort"
	"sync"
	"time"

	PTN "github.com/middelink/go-parse-torrent-name"
)

type Torrent struct {
	Infohash    string
	ContentName string
	TorrentName string
}

func parsing() {
	conn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable&options=-c%20pg_trgm.similarity_threshold=0.5"
	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Printf("%v", err)
	}
	defer db.Close()
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(5)
	infos, err := db.Query(`SELECT infohash, content_name, torrent_name from movie_torrents where title is null`)
	if err != nil {
		log.Printf("Error: %v", err)
	}
	defer infos.Close()
	count := 0
	sem := make(chan Torrent, 300)
	var wg sync.WaitGroup
	batchSize := 100
	//NOTE: chan = good distribute resources for goroutine
	for _ = range 20 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			infohashes := make([]string, 0, batchSize)
			contentNames := make([]string, 0, batchSize)
			torrentNames := make([]string, 0, batchSize)
			titles := make([]string, 0, batchSize)
			seasons := make([]int, 0, batchSize)
			episodes := make([]int, 0, batchSize)
			years := make([]int, 0, batchSize)
			resolutions := make([]string, 0, batchSize)
			codecs := make([]string, 0, batchSize)
			args := make([]any, 0, len(infohashes)*8)
			flush := func() {
				if len(infohashes) == 0 {
					return
				}

				var sb strings.Builder
				sb.WriteString(`update movie_torrents mt set 
					title = t.title,
					season = t.season,
					episode = t.episode,
					"year" = t.year,
					resolution = t.resolution,
					codec = t.codec
					FROM (VALUES
					`)
				for i := 0; i < len(infohashes); i++ {
					if i > 0 {
						sb.WriteString(`, `)
					}
					fmt.Fprintf(&sb, "($%d::text, $%d::text, $%d::text, $%d::text, $%d::int, $%d::int, $%d::int, $%d::text, $%d::text)",
						i*9+1, i*9+2, i*9+3, i*9+4,
						i*9+5, i*9+6, i*9+7, i*9+8, i*9+9,
					)
					args = append(args, infohashes[i], contentNames[i], contentNames[i], titles[i],
						seasons[i], episodes[i], years[i], resolutions[i], codecs[i])
				}
				sb.WriteString(`) AS t(infohash, content_name, torrent_name, title, season, episode, year, resolution, codec) 
                        WHERE mt.infohash = t.infohash AND mt.content_name = t.content_name`)
				_, err = db.Exec(sb.String(), args...)
				if err != nil {
					log.Printf("Error: %v", err)
				}
				infohashes = infohashes[:0]
				contentNames = contentNames[:0]
				torrentNames = torrentNames[:0]
				titles = titles[:0]
				seasons = seasons[:0]
				episodes = episodes[:0]
				years = years[:0]
				resolutions = resolutions[:0]
				codecs = codecs[:0]
				args = args[:0]
			}
			for task := range sem {
				info, err := PTN.Parse(task.ContentName)
				info_t, err := PTN.Parse(task.TorrentName)
				title := strings.Trim(info.Title, "!? -._/\\")
				if len(strings.Trim(info.Title, "!? -._")) < len(strings.Trim(info_t.Title, "!? -._")) {
					title = strings.Trim(info_t.Title, "!? -._")
				}
				if err != nil {
					continue
				}
				infohashes = append(infohashes, task.Infohash)
				contentNames = append(contentNames, task.ContentName)
				torrentNames = append(torrentNames, task.TorrentName)
				titles = append(titles, title)
				seasons = append(seasons, info.Season)
				episodes = append(episodes, info.Episode)
				years = append(years, info.Year)
				resolutions = append(resolutions, info.Resolution)
				codecs = append(codecs, info.Codec)
				if len(infohashes) >= batchSize {
					flush()
				}
				log.Printf("done - %s -%s", title, task.Infohash)

			}
			flush()
		}()
	}

	for infos.Next() {
		count++
		var rec Torrent
		if err := infos.Scan(&rec.Infohash, &rec.ContentName, &rec.TorrentName); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		count++
		sem <- rec
	}
	close(sem)
	wg.Wait()
	log.Println("DOne")

}

func doThingsWithCsv() {
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
		wg.Add(1)
		go func(record []string) {
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
P/s: this is useless btw, cause the TorrentInfo struct dont have `omitempty`
in defend, at first it have omitempty tho
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
