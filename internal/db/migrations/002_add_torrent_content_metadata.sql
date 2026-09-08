-- +goose Up
ALTER TABLE torrent_contents
    ADD COLUMN IF NOT EXISTS season INT,
    ADD COLUMN IF NOT EXISTS episode INT,
    ADD COLUMN IF NOT EXISTS resolution TEXT,
    ADD COLUMN IF NOT EXISTS codec TEXT,
    ADD COLUMN IF NOT EXISTS quality TEXT;

-- +goose Down
ALTER TABLE torrent_contents
    DROP COLUMN IF EXISTS season,
    DROP COLUMN IF EXISTS episode,
    DROP COLUMN IF EXISTS resolution,
    DROP COLUMN IF EXISTS codec,
    DROP COLUMN IF EXISTS quality;
