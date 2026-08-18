package service

import (
	"encoding/json"
	"fmt"
	"io"
	"lim/internal/config"
	"net/http"
	"net/url"
)

func FetchMetaDetail(query TmdbQuery, uri UriParams) (ContentResponse, error) {
	var result ContentResponse
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%d", uri.Type, uri.ID),
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
func FetchMediaSearch(query TmdbQuery, uri UriParams) (ContentResponse, error) {
	var result ContentResponse
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

func FetchMediaTrending(query TmdbQuery, uri MediaTrendingUriParams) (ContentResponse, error) {
	var result ContentResponse
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%s", uri.Type, uri.TimeWindow),
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
	if err != nil {
		return nil, fmt.Errorf("failed fetch tmdb: %w", err)
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().APIkey.TmDB))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed fetch tmdb: %w", err)
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("failed fetch tmdb: %w", err)

	}
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("failed fetch tmdb: %w", err)
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
