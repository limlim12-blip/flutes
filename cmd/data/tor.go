package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/anacrolix/torrent"
	"golang.org/x/time/rate"
	"net/http"
	_ "net/http/pprof"
)

/*
after that delete all the torrent contain .exe
DELETE FROM torrent_content WHERE infohash IN ( SELECT tc.infohash FROM torrent_content tc WHERE tc.content_name LIKE '%.exe%');


*/

func tor() {
	go func() {
		// Starts a web server on port 6060 that exposes internal Go metrics
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()
	go func() {
		<-time.After(30 * time.Minute)
		os.Exit(0)
	}()
	conn := "postgres://postgres:postgres@db:5432/postgres?sslmode=disable&options=-c%20pg_trgm.similarity_threshold=0.5"
	trakerFile, err := os.Open("./cmd/data/tracker.txt")
	if err != nil {
		log.Printf("%v", err)
	}
	defer trakerFile.Close()
	s := bufio.NewScanner(trakerFile)
	trackers := ""
	for s.Scan() {
		line := s.Text()
		if len(strings.TrimSpace(line)) != 0 {
			line = "&tr=" + line
			trackers += line
		}
	}
	if err := s.Err(); err != nil {
		log.Fatalf("scan: %s", err)
	}

	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Printf("%v", err)
	}
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(5)
	var infoHash []string
	infohash, err := db.Query(`SELECT DISTINCT t.infohash, seeders FROM torrents t LEFT JOIN torrent_content tc ON t.infohash = tc.infohash where tc.infohash is null ORDER BY seeders desc`)
	if err != nil {
		log.Printf("%v", err)
	}
	for infohash.Next() {
		var hash string
		var seeders int
		if err := infohash.Scan(&hash, &seeders); err != nil {
			log.Printf("%v", err)
		}
		infoHash = append(infoHash, hash)
	}
	numClients := 40
	os.RemoveAll("./tor/")
	os.MkdirAll("./tor/", 0755)
	var clients []*torrent.Client
	for i := 0; i < numClients; i++ {
		cc := torrent.NewDefaultClientConfig()
		cc.TotalHalfOpenConns = 1000
		cc.DialRateLimiter = rate.NewLimiter(1000, 1200)
		cc.HalfOpenConnsPerTorrent = 20
		cc.EstablishedConnsPerTorrent = 20
		cc.NominalDialTimeout = 5 * time.Second
		cc.MinDialTimeout = 2 * time.Second
		cc.NoDefaultPortForwarding = true
		cc.ListenPort = 0
		cc.DataDir = "./tor/"
		c, err := torrent.NewClient(cc)
		if err != nil {
			log.Fatalf("failed %d: %v", i, err)
		}
		clients = append(clients, c)
	}

	var wg sync.WaitGroup
	sem := make(chan struct{}, 1000)
	log.Println(trackers)
	// infoHash = []string{"f0ac298509c7546daf0fe29f2891333508e26100"}
	for count, infoHashHex := range infoHash {
		magnetLink := fmt.Sprintf("magnet:?xt=urn:btih:%s%s", infoHashHex, trackers)
		wg.Add(1)
		sem <- struct{}{}
		aClient := clients[count%numClients]
		go func(magnetLink string, aClient *torrent.Client, infoHashHex string) {
			defer wg.Done()
			defer func() { <-sem }()
			//NOTE: if it panic while drop it will crash, this to prevent it,
			//t.Drop() can return panic if while drop it get a package from peer
			defer func() {
				if r := recover(); r != nil {
					log.Printf("panic: %v", r)
				}
			}()
			t, err := aClient.AddMagnet(magnetLink)
			if err != nil {
				log.Printf("%v", err)
				return
			}
			defer t.Drop()

			log.Printf("[%d] start on: %s\n", count, infoHashHex)
			select {
			case <-t.GotInfo():
				fmt.Println("found!")
			case <-time.After(300 * time.Second):
				log.Println("timeout")
				_, err := db.Exec(`INSERT INTO torrent_content (infohash, torrent_name, content_name, size_bytes)
				VALUES ($1, $2, $3, $4)
				ON CONFLICT DO NOTHING;`, infoHashHex, nil, nil, nil)
				if err != nil {
					log.Printf("Error: %v", err)
				}
				return
			}
			info := t.Info()
			var sb strings.Builder
			fmt.Printf("Done [%d] - Name: %s\n", count, info.Name)
			fmt.Fprintf(&sb, "Done [%d]\nName: %s\n", count, info.Name)
			valueStrings := make([]string, 0)
			valueArgs := make([]any, 0)
			for i, file := range info.UpvertedFiles() {
				path := file.DisplayPath(info)
				fmt.Fprintf(&sb, "- %s (%d bytes)\n", path, file.Length)
				valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*4+1, i*4+2, i*4+3, i*4+4))
				valueArgs = append(valueArgs, infoHashHex, strings.ToValidUTF8(info.Name, ""), strings.ToValidUTF8(path, ""), file.Length)
			}
			stmt := fmt.Sprintf(
				`INSERT INTO torrent_content (infohash, torrent_name, content_name, size_bytes)
				VALUES %s
				ON CONFLICT DO NOTHING;`,
				strings.Join(valueStrings, ","))
			_, err = db.Exec(stmt, valueArgs...)
			if err != nil {
				log.Printf("Error: %v", err)
			}
			// log.Println(sb.String())
		}(magnetLink, aClient, infoHashHex)
	}
	wg.Wait()
}
func matching_torrent() {
	conn := "postgres://postgres:postgres@db:5432/postgres?sslmode=disable&options=-c%20pg_trgm.similarity_threshold=0.5"
	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Printf("%v", err)
	}
	db.SetMaxIdleConns(100)
	db.SetMaxOpenConns(100)
	db.SetConnMaxLifetime(time.Minute * 5)
	if _, err = db.Exec("SELECT pg_prewarm('idx_trgm_name');"); err != nil {
		log.Printf("%v", err)
	}
	defer db.Close()
	tmdbQuery := `SELECT id, title, release_date, popularity FROM "tmdb_movie_dataset_v11" WHERE adult = FALSE ORDER BY vote_count DESC;`
	movieRows, err := db.Query(tmdbQuery)
	if err != nil {
		log.Printf("%v", err)
	}
	defer movieRows.Close()
	matchedId, err := db.Query(`SELECT distinct match_id from torrent_match`)
	if err != nil {
		log.Printf("%v", err)
	}
	matchedMap := make(map[int]struct{})
	for matchedId.Next() {
		var id int
		if err := matchedId.Scan(&id); err != nil {
			log.Printf("%v", err)
		}
		matchedMap[id] = struct{}{}
	}
	if err = matchedId.Err(); err != nil {
		log.Printf("%v", err)
	}
	defer matchedId.Close()
	count := 0
	notFound := 0
	// var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, 90)
	for movieRows.Next() {
		count += 1
		var tmdbID int
		var tmdbTitle, releaseDate string
		var popularity float64
		if err := movieRows.Scan(&tmdbID, &tmdbTitle, &releaseDate, &popularity); err != nil {
			log.Println(err)
		}
		if _, exists := matchedMap[tmdbID]; exists {
			notFound = count - len(matchedMap)
			continue
		}

		year := ""
		if len(releaseDate) >= 4 {
			year = releaseDate[:4]
		}
		sem <- struct{}{}
		wg.Add(1)
		go func(tmdbID int, tmdbTitle, releaseDate string, popularity float64) {
			defer func() { <-sem }()
			defer wg.Done()
			var sb strings.Builder
			matchRows, err := db.Query(`
				SELECT *
				FROM (
					SELECT 
						content_name, 
						infohash,
						size_bytes,

						(
							similarity(content_name, $1) + 
							CASE WHEN content_name ~ $2 THEN 0.2 ELSE 0.0 END
						) AS score
					FROM movie_torrents
					WHERE content_name % $1
				) sub
				WHERE score > 0.5
				ORDER BY score DESC;
			`, tmdbTitle, year)
			if err != nil {
				log.Println(err)
				return
			}
			defer matchRows.Close()
			type match struct {
				name       string
				hash       string
				score      float64
				size_bytes int
			}
			var result []match
			for matchRows.Next() {
				var torrentName, infohash string
				var score float64
				var size_bytes int

				if err := matchRows.Scan(&torrentName, &infohash, &score, &size_bytes); err != nil {
					fmt.Println(err)
					continue
				}
				result = append(result, match{torrentName, infohash, score, size_bytes})

			}
			if err := matchRows.Err(); err != nil {
				log.Printf("%v", err)
				return
			}
			fmt.Fprintf(&sb, "{%d-%d}\n--- Searching for: [%d] %s (%s)-%.2f-----\n", count, notFound, tmdbID, tmdbTitle, year, popularity)
			if len(result) == 0 {
				sb.WriteString(" No torrents found\n")
				notFound += 1
				_, err := db.Exec(
					`INSERT INTO torrent_match_movie (infohash, name, match_name, match_id)
					VALUES ($1, $2, $3, $4)
					ON CONFLICT DO NOTHING;`,
					nil, nil, tmdbTitle, tmdbID)
				if err != nil {
					log.Printf("1%v", err)
				}

			} else {
				valueStrings := make([]string, 0, len(result))
				valueArgs := make([]any, 0, len(result)*4)
				for i, m := range result {
					yearMatch := ""
					if year != "" && strings.Contains(m.name, year) {
						yearMatch = " [YEAR MATCH]"
					}
					fmt.Fprintf(&sb, "[%d] Score: %.3f | Hash: %s | %s - %s\n", i, m.score, m.hash, m.name, yearMatch)
					valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*4+1, i*4+2, i*4+3, i*4+4))
					valueArgs = append(valueArgs, m.hash, m.name, tmdbTitle, tmdbID)
				}
				stmt := fmt.Sprintf(
					`INSERT INTO torrent_match (infohash, name, match_name, match_id)
				VALUES %s
				ON CONFLICT DO NOTHING;`,
					strings.Join(valueStrings, ","))
				_, err = db.Exec(stmt, valueArgs...)
				if err != nil {
					log.Printf("2%v", err)
				}
			}
			log.Print(sb.String())
			if count%1000 == 0 {
				log.Printf("Processed %d movies...", count)
			}
		}(tmdbID, tmdbTitle, releaseDate, popularity)
	}
	wg.Wait()
}
