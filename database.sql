CREATE EXTENSION IF NOT EXISTS pg_prewarm;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE TABLE IF NOT EXISTS tmdb_movie_dataset_v11 (
	id int4 NULL,
	title text NULL,
	vote_average float4 NULL,
	vote_count int4 NULL,
	status varchar(50) NULL,
	release_date varchar(50) NULL,
	revenue int8 NULL,
	runtime int4 NULL,
	adult bool NULL,
	backdrop_path varchar(255) NULL,
	budget int4 NULL,
	homepage text NULL,
	imdb_id varchar(50) NULL,
	original_language varchar(50) NULL,
	original_title text NULL,
	overview varchar(1024) NULL,
	popularity float4 NULL,
	poster_path varchar(255) NULL,
	tagline text NULL,
	genres text NULL,
	production_companies text NULL,
	production_countries text NULL,
	spoken_languages text NULL,
	keywords text NULL
);
COPY tmdb_movie_dataset_v11 FROM '/stuff/TMDB_movie_dataset_v11.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
CREATE INDEX idx_title_fts ON tmdb_movie_dataset_v11 USING gin (to_tsvector('english'::regconfig, title));
CREATE INDEX idx_tmdb_title_trgm ON tmdb_movie_dataset_v11 USING gin (title gin_trgm_ops);

CREATE TABLE IF NOT EXISTS torrents (
	infohash varchar(45) NULL,
	"name" varchar(255) NULL,
	size_bytes int8 NULL,
	created_unix text NULL,
	seeders int4 NULL,
	leechers int4 NULL,
	completed int4 NULL,
	scraped_date int4 NULL,
	published int4 NULL
);

set pg_trgm.similarity_threshold = 0.5;
COPY torrents FROM '/stuff/Torrents.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
CREATE INDEX idx_trgm_name ON torrents USING gin (name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS torrent_match (
	infohash varchar(45) NULL,
	"name" varchar(255) NULL,
	match_name text null,
	match_id int null
);

COPY torrent_match (infohash, "name", match_name, match_id) 
FROM '/stuff/torrent_match.csv' 
WITH (
    FORMAT csv, 
    HEADER true, 
    DELIMITER ','
);
CREATE TABLE public.torrent_content (
	infohash varchar(45) NULL,
	torrent_name varchar(255) NULL,
	content_name text null,
	size_bytes int8 null
)
