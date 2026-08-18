-- name: GetUnmatchedTorrents :many
SELECT t.infohash, t.name FROM torrents t WHERE NOT EXISTS ( SELECT 1 FROM torrent_contents tc WHERE tc.infohash = t.infohash) ORDER BY t.seeders DESC;

-- name: InsertTorrentContent :one
INSERT INTO torrent_contents (infohash, torrent_name, content_name, size_bytes, match_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING *;

-- name: BulkInsertTorrentContents :copyfrom
INSERT INTO torrent_contents (infohash, torrent_name, content_name, parsed_content_name,size_bytes, match_id) VALUES ($1, $2, $3, $4, $5, $6);


-- name: SearchMoviesByTitleAndYear :one
SELECT id
FROM (
    SELECT 
        id,
        popularity,
        (
            similarity(title, @title) + 
            CASE WHEN @release_year::text != '' 
                AND STARTS_WITH(release_date, @release_year::text) THEN 0.2 ELSE 0.0 
            END
        ) AS score
    FROM tmdb_movie_dataset_v11
    WHERE title % @title
) sub
WHERE score > 0.5
ORDER BY score DESC, popularity DESC
LIMIT 1;
