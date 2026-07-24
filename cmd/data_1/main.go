package main

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"

	_ "github.com/lib/pq"
)

func main() {
	conn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable&options=-c%20pg_trgm.similarity_threshold=0.3"
	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	tmdbQuery := `SELECT id, title, release_date, popularity FROM "tmdb_movie_dataset_v11" WHERE adult = FALSE ORDER BY vote_count DESC;`
	movieRows, err := db.Query(tmdbQuery)
	if err != nil {
		log.Fatal(err)
	}
	defer movieRows.Close()
	count := 0
	notFound := 0
	var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, 10)
	for movieRows.Next() {
		var tmdbID, tmdbTitle, releaseDate string
		var popularity float64
		if err := movieRows.Scan(&tmdbID, &tmdbTitle, &releaseDate, &popularity); err != nil {
			log.Println(err)
		}

		year := ""
		if len(releaseDate) >= 4 {
			year = releaseDate[:4]
		}
		sem <- struct{}{}
		wg.Add(1)
		go func(tmdbID, tmdbTitle, releaseDate string, popularity float64) {
			defer func() { <-sem }()
			defer wg.Done()
			matchRows, err := db.Query(`
				SELECT *
				FROM (
					SELECT 
						name, 
						infohash,
						(
							similarity(name, $1) + 
							CASE WHEN name ~ $2 THEN 0.2 ELSE 0.0 END
						) AS score
					FROM torrents
					WHERE name % $1
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
				name  string
				hash  string
				score float64
			}
			var result []match
			for matchRows.Next() {
				var torrentName, infohash string
				var score float64

				if err := matchRows.Scan(&torrentName, &infohash, &score); err != nil {
					fmt.Println(err)
					continue
				}
				result = append(result, match{torrentName, infohash, score})

			}
			mu.Lock()
			defer mu.Unlock()
			tx, err := db.Begin()
			if err != nil {
				log.Fatal(err)
				return
			}
			defer tx.Rollback()
			count += 1
			fmt.Printf("{%d-%d}\n--- Searching for: [%s] %s (%s)-%.2f-----\n", count, notFound, tmdbID, tmdbTitle, year, popularity)
			if len(result) == 0 {
				fmt.Println(" No torrents found")
				notFound += 1
			}
			insert_query, err := tx.Prepare(`
			INSERT INTO torrent_match (infohash, name, match_name, match_id)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT DO NOTHING; 
			`)
			if err != nil {
				log.Fatal(err)
				return
			}
			defer insert_query.Close()
			for i, m := range result {
				yearMatch := ""
				if year != "" && strings.Contains(m.name, year) {
					yearMatch = " [YEAR MATCH]"
				}
				fmt.Printf("[%d] Score: %.2f | Hash: %s | %s - %s\n", i, m.score, m.hash, m.name, yearMatch)
				if _, err := insert_query.Exec(m.hash, m.name, tmdbTitle, tmdbID); err != nil {
					log.Fatal(err)
					return
				}
			}
			tx.Commit()
		}(tmdbID, tmdbTitle, releaseDate, popularity)
	}
	wg.Wait()
}
