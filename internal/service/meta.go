package service

import (
	"encoding/json"
	"fmt"
	"io"
	"lim/internal/config"
	. "lim/internal/models"
	"log"
	"net/http"
	"net/url"
)

func FetchMetaDetail(query TmdbQuery, uri UriParams) (TMDBTvSeries, error) {
	var result TMDBTvSeries
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%d", uri.Type, uri.ID),
	}

	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	queryParams.Add("append_to_response", "aggregate_credits")
	log.Printf("%v-%d-%v", uri.Type, uri.ID, u.Path)
	u.RawQuery = queryParams.Encode()
	data, err := fetchTmDB(u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, err
	}
	return result, nil
}
func FetchMetaSeasonDetail(query TmdbQuery, uri UriParams) (TMDBSeason, error) {
	var result TMDBSeason
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%d/season/%d", uri.Type, uri.ID, uri.Season),
	}

	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	log.Printf("%v-%d-%v", uri.Type, uri.ID, u.Path)
	u.RawQuery = queryParams.Encode()
	data, err := fetchTmDB(u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, err
	}
	detail, err := FetchMetaDetail(query, uri)
	if err != nil {
		return result, err
	}

	result.ShowName = detail.Name
	return result, nil
}

func FetchMediaSearch(query TmdbQuery, uri UriParams) (TMDBResponse, error) {
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
	data, err := fetchTmDB(u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, err
	}
	return result, nil
}

func FetchMediaTrending(query TmdbQuery, uri MediaTrendingUriParams) (TMDBResponse, error) {
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
	data, err := fetchTmDB(u)
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return result, err
	}
	return result, nil
}
func fetchTmDB(url *url.URL) ([]byte, error) {
	req, err := http.NewRequest("GET", url.String(), nil)
	log.Print(url.String())
	if err != nil {
		return nil, fmt.Errorf("failed fetch tmdb: %v", err)
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().APIkey.TmDB))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed fetch tmdb: %v", err)
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("tmdb returned status %d: %s", res.StatusCode, string(body))
	}
	if err != nil {
		return nil, err
	}
	return body, nil
}
