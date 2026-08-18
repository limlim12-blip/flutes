package service

type ContentResponse struct {
	Page         int       `json:"page,omitempty"`
	Results      []Content `json:"results,omitempty"`
	TotalPages   int       `json:"total_pages,omitempty"`
	TotalResults int       `json:"total_results,omitempty"`
}

// A mix of all
type Content struct {
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
	KnownFor           []Content `json:"known_for,omitempty"`            // People
}

type TmdbQuery struct {
	Page     int    `form:"page,default=1"`
	Query    string `form:"query"`
	Order    string `form:"order,default=ASC"`
	Language string `form:"language,default=en-US"`
}
type UriParams struct {
	Type string `uri:"type" binding:"required,oneof=movie tv pesron all multi"`
	ID   int    `uri:"id" binding:"required,gt=0"`
}

type MediaTrendingUriParams struct {
	Type       string `uri:"type" binding:"required,oneof=movie tv pesron all multi"`
	TimeWindow string `uri:"time_window,oneof=day week,default=week"`
}
