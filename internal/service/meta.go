package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"lim/internal/config"
	"lim/internal/errors"
	. "lim/internal/models"
	. "lim/pkg/logger"
)

func FetchMetaSeasonDetail(ctx context.Context, query TmDBMetaDetailQuery, uri TmDBMetaSeasonDetailUri) (TMDBSeason, *errors.ApiError) {
	var result TMDBSeason
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%d/season/%d", uri.Type, uri.ID, uri.Season),
	}
	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	u.RawQuery = queryParams.Encode()
	data, err := fetchTmDB(ctx, u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, errors.NewInternal("failed to parse TMDB season detail JSON", err)
	}
	detail, err := FetchMetaDetail(ctx, query, TmDBMetaDetailUri{ID: uri.ID, Type: uri.Type})
	if err != nil {
		return result, err
	}

	result.SeriesID = uri.ID
	result.ShowName = detail.Name
	return result, nil
}

func FetchMetaDetail(ctx context.Context, query TmDBMetaDetailQuery, uri TmDBMetaDetailUri) (TMDBDetail, *errors.ApiError) {
	var result TMDBDetail
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%d", uri.Type, uri.ID),
	}

	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	switch uri.Type {
	case "movie":
		queryParams.Add("append_to_response", "credits")
	case "tv":
		queryParams.Add("append_to_response", "aggregate_credits")
	}
	u.RawQuery = queryParams.Encode()
	Sugar.Debugw("FetchMetaDetail request", "type", uri.Type, "iD", uri.ID, "path", u.Path)

	data, err := fetchTmDB(ctx, u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, errors.NewInternal("failed to parse TMDB detail JSON", err)
	}
	return result, nil
}

func FetchMediaSearch(ctx context.Context, query TmDBMediaSearchQuery, uri TmDBMediaSearchUri) (TMDBResponse, *errors.ApiError) {
	var result TMDBResponse
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/search/%s", uri.Type),
	}
	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	queryParams.Add("page", fmt.Sprintf("%d", query.Page))
	queryParams.Add("query", query.Query)
	u.RawQuery = queryParams.Encode()
	data, err := fetchTmDB(ctx, u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, errors.NewInternal("failed to parse TMDB search JSON", err)
	}
	return result, nil
}
func FetchMediaTrending(ctx context.Context, query TmDBMediaTrendingQuery, uri TmDBMediaTrendingUri) (TMDBResponse, *errors.ApiError) {
	var result TMDBResponse
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/trending/%s/%s", uri.Type, uri.TimeWindow),
	}

	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	queryParams.Add("page", fmt.Sprintf("%d", query.Page))
	u.RawQuery = queryParams.Encode()

	data, err := fetchTmDB(ctx, u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, errors.NewInternal("failed to parse TMDB trending JSON", err)
	}
	return result, nil
}

func fetchTmDB(ctx context.Context, url *url.URL) ([]byte, *errors.ApiError) {
	req, err := http.NewRequestWithContext(ctx, "GET", url.String(), nil)
	if err != nil {
		return nil, errors.NewInternal(fmt.Sprintf("failed to create request for %s", url.String()), err)
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().APIkey.TmDB))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, errors.NewInternal(fmt.Sprintf("network failure fetching from %s", url.String()), err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.NewInternal(fmt.Sprintf("failed to read TmDB response from %s", url.String()), err)
	}

	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, &errors.ApiError{
			HTTPCode: res.StatusCode,
			Message:  "TmDB API returned an error",
			Err:      fmt.Errorf("status %d for %s: %s", res.StatusCode, url.String(), string(body)),
		}
	}
	return body, nil
}
