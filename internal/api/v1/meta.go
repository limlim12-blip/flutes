package v1

import (
	"encoding/json"
	"fmt"
	"io"
	"lim/internal/config"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type MetaHandler struct {
	*APIHandler
}

func InitMetaHandler(app *APIHandler) MetaHandler {
	return MetaHandler{app}
}

type contentResponse struct {
	Page         int       `json:"page,omitempty"`
	Results      []content `json:"results,omitempty"`
	TotalPages   int       `json:"total_pages,omitempty"`
	TotalResults int       `json:"total_results,omitempty"`
}

// A mix of all
type content struct {
	Adult              bool      `json:"adult,omitempty"`
	BackdropPath       string    `json:"backdrop_path,omitempty"`
	ID                 int       `json:"id,omitempty"`
	Title              string    `json:"title,omitempty"` // Movie
	Name               string    `json:"name,omitempty"`  // TV People
	OriginalLanguage   string    `json:"original_language,omitempty"`
	OriginalTitle      string    `json:"original_title,omitempty"`
	OriginalName       string    `json:"original_name,omitempty"` // TV
	Overview           string    `json:"overview,omitempty"`
	PosterPath         string    `json:"poster_path,omitempty"`
	MediaType          string    `json:"media_type,omitempty"`
	GenreIDs           []int     `json:"genre_ids,omitempty"`
	Popularity         float64   `json:"popularity,omitempty"`
	FirstAirDate       string    `json:"first_air_date,omitempty"` // TV
	ReleaseDate        string    `json:"release_date,omitempty"`   // Movie
	VoteAverage        float64   `json:"vote_average,omitempty"`
	VoteCount          int       `json:"vote_count,omitempty"`
	KnownForDepartment string    `json:"known_for_department,omitempty"` // People
	ProfilePath        string    `json:"profile_path,omitempty"`         //People
	KnownFor           []content `json:"known_for,omitempty"`            // People
}

type tmdbQuery struct {
	Page     int    `form:"page,default=1"`
	Query    string `form:"query"`
	Order    string `form:"order,default=ASC"`
	Language string `form:"language,default=en-US"`
}
type uriParams struct {
	Type string `uri:"type" binding:"required,oneof=movie tv pesron all multi"`
	ID   int    `uri:"id" binding:"required,gt=0"`
}

type mediaTrendingUriParams struct {
	Type       string `uri:"type" binding:"required,oneof=movie tv pesron all multi"`
	TimeWindow string `uri:"time_window,oneof=day week,default=week"`
}

func (h *MetaHandler) RegisterRoutes() {
	courses := h.APIHandler.RouterGroup.Group("/meta")
	courses.GET("/discover/:type", h.GetMediaTrending)
	courses.GET("/search/:type", h.GetMediaSearch)
	courses.GET("/title/:type/:id", h.GetMetaDetail)
	courses.GET("/title/:type/:id/seasons", h.GetMetaSeason)
}
func (h *MetaHandler) GetMetaSeason(c *gin.Context) {
}

func (h *MetaHandler) GetMediaTrending(c *gin.Context) {
	var query tmdbQuery
	var uri mediaTrendingUriParams
	if !BindAndValidateParams(c, uri, &query, nil) {
		return
	}
	// url := fmt.Sprintf("https://api.themoviedb.org/3/trending/%s/%s?language=%s&page=%d", uri.Type, uri.TimeWindow, query.Language, query.Page)
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%s", uri.Type, uri.TimeWindow),
	}
	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	queryParams.Add("page", fmt.Sprintf("%d", query.Page))
	u.RawQuery = queryParams.Encode()
	data, err := fetch(c, u)
	if err != nil {
		log.Printf("TMDb Error: %v", err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "Failed TMDb"})
		return
	}

	var result contentResponse
	if err := json.Unmarshal(data, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upstream parsing failed"})
		return
	}
	c.JSON(200, result)
}

func (h *MetaHandler) GetMetaDetail(c *gin.Context) {
	var query tmdbQuery
	var uri uriParams
	if !BindAndValidateParams(c, uri, &query, nil) {
		return
	}
	// url := fmt.Sprintf("https://api.themoviedb.org/3/%s/%d?language=%s&page=%d", uri.Type, uri.ID, query.Language, query.Page)
	u := &url.URL{
		Scheme: "https",
		Host:   "api.themoviedb.org",
		Path:   fmt.Sprintf("/3/%s/%d", uri.Type, uri.ID),
	}

	queryParams := url.Values{}
	queryParams.Add("language", query.Language)
	queryParams.Add("page", fmt.Sprintf("%d", query.Page))
	u.RawQuery = queryParams.Encode()
	data, err := fetch(c, u)
	if err != nil {
		return
	}
	var result contentResponse
	if err := json.Unmarshal(data, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upstream parsing failed"})
		return
	}
	c.JSON(200, result)
}

func (h *MetaHandler) GetMediaSearch(c *gin.Context) {
	var query tmdbQuery
	var uri uriParams
	if !BindAndValidateParams(c, uri, &query, nil) {
		return
	}
	// url := fmt.Sprintf("https://api.themoviedb.org/3/search/%s?language=%s&page=%d&query=%s", uri.Type, query.Language, query.Page, query.Query)
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
	data, err := fetch(c, u)
	if err != nil {
		return
	}
	var result contentResponse
	if err := json.Unmarshal(data, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upstream parsing failed"})
		return
	}
	c.JSON(200, result)
}
func fetch(c *gin.Context, url *url.URL) ([]byte, error) {
	req, err := http.NewRequest("GET", url.String(), nil)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Failed TMDb"})
		return nil, err
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().APIkey.TmDB))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed TMDb"})
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("%s not found", url.Path)})
		return nil, err

	}
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed TMDb"})
		return nil, err
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
