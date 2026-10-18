-- name: GetUnmatchedTorrents :many
SELECT t.infohash, t.name FROM torrents t WHERE NOT EXISTS ( SELECT 1 FROM torrent_contents tc WHERE tc.infohash = t.infohash) ORDER BY t.seeders DESC;

-- name: InsertTorrentContent :one
INSERT INTO torrent_contents (infohash, torrent_name, content_name, size_bytes, match_id, season, Episode, Resolution, Codec, Quality, parsed_content_name, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT DO NOTHING RETURNING *;

-- name: BulkInsertTorrentContents :copyfrom
INSERT INTO torrent_contents (infohash, torrent_name, content_name, size_bytes, match_id, season, Episode, Resolution, Codec, Quality, parsed_content_name, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);

-- name: BulkInsertTMDB :copyfrom
INSERT INTO tmdb_movie_dataset_v11 (
    id ,
    title ,
    vote_average ,
    vote_count ,
    release_date ,
    original_language ,
    original_title ,
    popularity 
) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8 );

-- name: InsertTMDB :exec
INSERT INTO tmdb_movie_dataset_v11 (
    id,
    title,
    vote_average,
    vote_count,
    release_date,
    original_language,
    original_title,
    popularity,
    type
) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
ON CONFLICT (id, type) 
DO UPDATE SET
(id, title, vote_average, vote_count, release_date, original_language, original_title, popularity) =
(EXCLUDED.id, EXCLUDED.title, EXCLUDED.vote_average, EXCLUDED.vote_count, EXCLUDED.release_date, EXCLUDED.original_language, EXCLUDED.original_title, EXCLUDED.popularity);

-- name: SearchMoviesByTitleAndYear :one
SELECT id, NULLIF(type, '')::text as type
FROM (
    SELECT 
        id,
        type,
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

-- name: GetFilteredTorrentContents :many
SELECT tc.*, t.seeders, t.leechers, t.published
FROM torrent_contents tc 
JOIN torrents t ON t.infohash = tc.infohash 
WHERE (sqlc.narg('match_id')::int IS NULL OR tc.match_id = sqlc.narg('match_id'))
    AND (sqlc.arg('type')::text NOT IN ('tv', 'movie') OR tc.type = sqlc.narg('type'))
    AND (sqlc.narg('quality')::text IS NULL OR tc.quality = sqlc.narg('quality'))
    AND (sqlc.narg('resolution')::text IS NULL OR tc.resolution = sqlc.narg('resolution'))
    AND (sqlc.narg('season')::int IS NULL OR tc.season = sqlc.narg('season'))
    AND (sqlc.narg('episode')::int IS NULL OR tc.episode = sqlc.narg('episode'))
ORDER BY t.seeders DESC, tc.content_name ASC
LIMIT sqlc.arg(page_limit) OFFSET sqlc.arg(page_offset);
