-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS pgroonga;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE EXTENSION IF NOT EXISTS pg_prewarm;

-- tmdb
CREATE TABLE IF NOT EXISTS tmdb_movie_dataset_v11 (
    id int PRIMARY KEY,
    title text NOT NULL,
    vote_average numeric(3, 1),
    vote_count int,
    status varchar(50),
    release_date text,
    revenue bigint,
    runtime int,
    adult boolean DEFAULT FALSE,
    backdrop_path text,
    budget bigint,
    homepage text,
    imdb_id varchar(20),
    original_language varchar(10),
    original_title text,
    overview text,
    popularity numeric(10, 3),
    poster_path text,
    tagline text,
    genres text,
    production_companies text,
    production_countries text,
    spoken_languages text,
    keywords text
);

CREATE TEMP TABLE temp_tmdb AS
SELECT
    *
FROM
    tmdb_movie_dataset_v11 WITH NO DATA;

COPY temp_tmdb
FROM
    '/stuff/TMDB_movie_dataset_v11.csv' WITH (
        FORMAT csv,
        HEADER TRUE,
        DELIMITER ',');

INSERT INTO tmdb_movie_dataset_v11
SELECT
    *
FROM
    temp_tmdb
WHERE
    title IS NOT NULL
    AND title != ''
ON CONFLICT (id)
    DO NOTHING;

DROP TABLE temp_tmdb;

-- torrents
CREATE TABLE IF NOT EXISTS torrents (
    infohash varchar(40) PRIMARY KEY,
    name text NOT NULL,
    size_bytes bigint NOT NULL,
    created_unix bigint,
    seeders int DEFAULT 0,
    leechers int DEFAULT 0,
    completed int DEFAULT 0,
    scraped_date timestamp with time zone,
    published timestamp with time zone
);

CREATE TEMP TABLE temps_torrents (
    infohash varchar(40),
    name text,
    size_bytes bigint,
    created_unix bigint,
    seeders int,
    leechers int,
    completed int,
    scraped_date bigint,
    published bigint
);

COPY temps_torrents
FROM
    '/stuff/Torrents.csv' WITH (
        FORMAT csv,
        HEADER TRUE,
        DELIMITER ',');

INSERT INTO torrents
SELECT
    infohash,
    name,
    size_bytes,
    created_unix,
    seeders,
    leechers,
    completed,
    to_timestamp(scraped_date),
    to_timestamp(published)
FROM
    temps_torrents
ON CONFLICT (infohash)
    DO NOTHING;

DROP TABLE temps_torrents;

-- index
CREATE TABLE IF NOT EXISTS torrent_contents (
    id int GENERATED ALWAYS AS IDENTITY,
    infohash varchar(40) NOT NULL REFERENCES torrents (infohash) ON DELETE CASCADE,
    torrent_name text NOT NULL,
    content_name text NOT NULL,
    parsed_content_name text NULL,
    size_bytes bigint NOT NULL,
    match_id int
);

CREATE INDEX IF NOT EXISTS idx_torrent_contents_infohash ON torrent_contents (infohash);

CREATE INDEX IF NOT EXISTS idx_torrent_contents_match_id ON torrent_contents (match_id)
WHERE
    match_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_torrents_seeders ON torrents (seeders DESC);

CREATE INDEX IF NOT EXISTS idx_torrents_name_pgroonga ON torrents USING pgroonga (name);

CREATE INDEX IF NOT EXISTS idx_tmdb_title_pgroonga ON tmdb_movie_dataset_v11 USING pgroonga (title);

CREATE INDEX IF NOT EXISTS idx_tmdb_title_trgm ON tmdb_movie_dataset_v11 USING gin (title gin_trgm_ops);

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_tmdb_title_trgm;

DROP INDEX IF EXISTS idx_torrents_name_pgroonga;

DROP INDEX IF EXISTS idx_tmdb_title_pgroonga;

DROP INDEX IF EXISTS idx_torrents_seeders;

DROP INDEX IF EXISTS idx_torrent_contents_match_id;

DROP INDEX IF EXISTS idx_torrent_contents_infohash;

DROP TABLE IF EXISTS torrent_contents;

DROP TABLE IF EXISTS torrents;

DROP TABLE IF EXISTS tmdb_movie_dataset_v11;

-- +goose StatementEnd
