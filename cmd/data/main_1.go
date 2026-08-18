package main

import (
	"database/sql"
	"fmt"
	"strings"
	"sync"
	"sync/atomic"

	_ "github.com/jackc/pgx/v5/stdlib"

	"log"
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
/*
SELECT infohash, content_name, title

DELETE FROM movie_torrents
WHERE content_name ~ '無修正|アダルト|エロ|ポルノ|AV女優|盗撮|素人|人妻|巨乳|痴漢|熟女|モザイク破壊'
   OR title ~ '無修正|アダルト|エロ|ポルノ|AV女優|盗撮|素人|人妻|巨乳|痴漢|熟女|モザイク破壊';

DELETE FROM movie_torrents
WHERE content_name ~* '(FC2-PPV|FC2PPV|Caribbeancom|1pondo|10musume|Heydouga|pacopacomama)';

DELETE FROM movie_torrents
WHERE content_name ~ '色情|无码|有码|步兵|骑兵|女优|三级片|乱伦|强奸|轮奸|偷拍|淫秽|巨乳|萝莉'
   OR title ~ '色情|无码|有码|步兵|骑兵|女优|三级片|乱伦|强奸|轮奸|偷拍|淫秽|巨乳|萝莉';

DELETE FROM movie_torrents
WHERE LOWER(content_name) SIMILAR TO '%(porn|xxx|anal|sex|nsfw|uncensored|jav|milf|gangbang|teen|boudoir|playboy|penthouse|brazzers|realitykings|naughtyamerica)%';

DELETE FROM movie_torrents
WHERE LOWER(content_name) SIMILAR TO '%(repack|cracked|keygen|patch|activation|trainer|flac|mp3|discography|album|epub|pdf|comic|cbr|cbz|android|apk|ios|windows|office)%';
*/

func main() {
	// info, _ := PTN.Parse("DS9 S02 AI_Upscale-1080p")
	// fmt.Printf("%#v", info)
	matching()

}

type match struct {
	torrentName string
	contentName string
	infohash    string
	size_bytes  int
	score       float64
}
type pack struct {
	tmdbTitle string
	tmdbID    int
	year      string
}

func matching() {
	conn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable&options=-c%20pg_trgm.similarity_threshold=0.5"
	db, err := sql.Open("pgx", conn)
	if err != nil {
		log.Printf("%v", err)
	}
	defer db.Close()
	db.SetMaxOpenConns(30)
	db.SetMaxIdleConns(30)
	if _, err = db.Exec("SELECT pg_prewarm('idx_movie_torrents_content_trgm');"); err != nil {
		log.Printf("%v", err)
	}
	if _, err = db.Exec("SELECT pg_prewarm('idx_movie_torrents_title_trgm');"); err != nil {
		log.Printf("%v", err)
	}
	if _, err = db.Exec("SELECT pg_prewarm('idx_movie_torrents_torrent_name_trgm');"); err != nil {
		log.Printf("%v", err)
	}
	log.Println("stato")

	titles, err := db.Query(`SELECT t.title, t.id, COALESCE(EXTRACT(YEAR FROM t.release_date)::text, '') AS release_year
		FROM tmdb_movie_dataset_v11 t
		WHERE t.title IS NOT NULL 
		AND t.adult = false
		AND NOT EXISTS (
		  SELECT 1 
		  FROM torrent_match_movie m 
		  WHERE m.match_id = t.id
		)
		ORDER BY t.popularity DESC;`)
	if err != nil {
		log.Printf("Error: %v", err)
	}
	sem := make(chan pack, 10000)
	var count atomic.Int64
	var notFound atomic.Int64
	var wg sync.WaitGroup
	log.Println("stato1")

	for _ = range 10 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for task := range sem {
				var sb strings.Builder
				year := task.year
				if year == "" {
					year = "0000"
				}
				tmdbTitle := task.tmdbTitle
				tmdbID := task.tmdbID
				matchRows, err := db.Query(`
				SELECT *
				FROM (
					SELECT 
						torrent_name,
						content_name, 
						infohash,
						size_bytes,
						(
							similarity(title, $1) + 
							CASE WHEN content_name LIKE '%' || $2 || '%' THEN 0.1 ELSE 0.0 END +
							CASE WHEN torrent_name LIKE '%' || $2 || '%' THEN 0.2 ELSE 0.0 END
						) AS score
					FROM movie_torrents
					WHERE (content_name % $1 OR title % $1)
				) sub
				WHERE score > 0.5
				ORDER BY score DESC;
			`, tmdbTitle, year)
				if err != nil {
					log.Println(err)
					return
				}
				defer matchRows.Close()
				var result []match
				for matchRows.Next() {
					var mat match
					if err := matchRows.Scan(&mat.torrentName, &mat.contentName, &mat.infohash, &mat.size_bytes, &mat.score); err != nil {
						fmt.Println(err)
						continue
					}
					result = append(result, mat)
				}
				if err := matchRows.Err(); err != nil {
					log.Printf("%v", err)
					return
				}
				fmt.Fprintf(&sb, "{%d-%d}\n--- Searching for: [%d] %s (%s)----\n", count.Load(), notFound.Load(), tmdbID, tmdbTitle, year)
				if len(result) == 0 {
					sb.WriteString(" No torrents found\n")
					notFound.Add(1)
					_, err := db.Exec(
						`INSERT INTO torrent_match_movie (infohash, content_name, match_name, match_id)
					VALUES ($1, $2, $3, $4)
					ON CONFLICT DO NOTHING;`,
						sql.NullString{}, sql.NullString{}, tmdbTitle, tmdbID)
					if err != nil {
						log.Printf("1%v", err)
					}
				} else {
					valueStrings := make([]string, 0, len(result))
					valueArgs := make([]any, 0, len(result)*4)
					for i, m := range result {
						yearMatch := ""
						if year != "0000" && strings.Contains(m.contentName, year) {
							yearMatch = " [YEAR MATCH]"
						}
						fmt.Fprintf(&sb, "[%d] Score: %.3f | Hash: %s | %s - %s\n", i, m.score, m.infohash, m.contentName, yearMatch)
						valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*4+1, i*4+2, i*4+3, i*4+4))
						valueArgs = append(valueArgs, m.infohash, m.contentName, tmdbTitle, tmdbID)
					}
					stmt := fmt.Sprintf(
						`INSERT INTO torrent_match_movie (infohash, content_name, match_name, match_id)
				VALUES %s
				ON CONFLICT DO NOTHING;`,
						strings.Join(valueStrings, ","))
					_, err = db.Exec(stmt, valueArgs...)
					if err != nil {
						log.Printf("2%v", err)
					}
				}
				log.Print(sb.String())
			}
		}()
	}
	for titles.Next() {
		var rec pack
		if err := titles.Scan(&rec.tmdbTitle, &rec.tmdbID, &rec.year); err != nil {
			log.Printf("Error: %v", err)
			continue
		}
		count.Add(1)
		sem <- rec
	}
	close(sem)
	wg.Wait()
}

