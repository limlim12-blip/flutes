package models

import (
	"reflect"
)

// for database fetch
type TMDBFilter struct {
	Page       int32   `form:"page,default=1" binding:"gte=1"`
	Season     *int32  `form:"season"`
	Episode    *int32  `form:"episode"`
	Quality    *string `form:"quality"`
	Resolution *string `form:"resolution"`
}
type TMDBUri struct {
	Type string `uri:"type" binding:"required,oneof=movie tv pesron multi"`
	ID   int32  `uri:"id" binding:"required,gte=0"`
}

type TMDBResponse struct {
	Page         uint        `json:"page,omitempty"`
	Results      []MediaItem `json:"results,omitempty"`
	TotalPages   uint        `json:"total_pages,omitempty"`
	TotalResults uint        `json:"total_results,omitempty"`
}

// tmdb api fetch A mix of all
type MediaItem struct {
	Adult              bool        `json:"adult,omitempty"`
	BackdropPath       string      `json:"backdrop_path,omitempty"`
	ID                 uint        `json:"id,omitempty"`
	Name               string      `json:"name,omitempty"` // TV People
	OriginalLanguage   string      `json:"original_language,omitempty"`
	Title              string      `json:"title,omitempty"` // Movie
	OriginalTitle      string      `json:"original_title,omitempty"`
	OriginalName       string      `json:"original_name,omitempty"` // TV
	Overview           string      `json:"overview,omitempty"`
	PosterPath         string      `json:"poster_path,omitempty"`
	MediaType          MediaType   `json:"media_type,omitempty"`
	GenreIDs           []uint      `json:"genre_ids,omitempty"`
	Popularity         float64     `json:"popularity,omitempty"`
	AirDate            string      `json:"first_air_date,omitempty"` // TV
	ReleaseDate        string      `json:"release_date,omitempty"`   // Movie
	VoteAverage        float64     `json:"vote_average,omitempty"`
	VoteCount          uint        `json:"vote_count,omitempty"`
	KnownForDepartment string      `json:"known_for_department,omitempty"` // People
	ProfilePath        string      `json:"profile_path,omitempty"`         //People
	KnownFor           []MediaItem `json:"known_for,omitempty"`            // People
}

type MediaType string

const (
	TV    MediaType = "tv"
	Movie MediaType = "movie"
)

// NOTE: FetchMetaDetail + FetchMetaSeasonDetail
type TmDBMetaDetailUri struct {
	Type string `uri:"type" binding:"required,oneof=movie tv pesron multi"`
	ID   uint   `uri:"id" binding:"omitempty,gte=0"`
}
type TmDBMetaSeasonDetailUri struct {
	Type   string `uri:"type" binding:"required,oneof=movie tv pesron multi"`
	ID     uint   `uri:"id" binding:"omitempty,gte=0"`
	Season uint   `uri:"season_number" binding:"omitempty"`
}
type TmDBMetaDetailQuery struct {
	Language string `form:"language,default=en-US"`
}

// NOTE: FetchMediaSearch
type TmDBMediaSearchUri struct {
	Type string `uri:"type" binding:"required,oneof=movie tv pesron multi"`
}
type TmDBMediaSearchQuery struct {
	Page     uint   `form:"page,default=1"`
	Query    string `form:"query"`
	Language string `form:"language,default=en-US"`
}

// NOTE:FetchMediaTrending
type TmDBMediaTrendingQuery struct {
	Page     uint   `form:"page,default=1"`
	Language string `form:"language,default=en-US"`
}
type TmDBMediaTrendingUri struct {
	Type       string `uri:"type" binding:"oneof=movie tv person all"`
	TimeWindow string `uri:"time_window" binding:"required,oneof=day week"`
}
type Genre struct {
	Id   uint
	Name string
}
type TMDBDetail struct {
	Id               uint         `json:"id,omitempty"`
	CreatedBy        []Creator    `json:"created_by"`
	AirDate          string       `json:"first_air_date,omitempty"`
	BackdropPath     string       `json:"backdrop_path,omitempty"`
	Genres           []Genre      `json:"genres,omitempty"`
	Homepage         string       `json:"homepage,omitempty"`
	Languages        []string     `json:"languages,omitempty"`
	NumberOfEpisodes uint         `json:"number_of_episodes,omitempty"`
	NumberOfSeasons  uint         `json:"number_of_seasons,omitempty"`
	OriginCountry    []string     `json:"origin_country,omitempty"`
	OriginalLanguage string       `json:"original_language,omitempty"`
	Title            string       `json:"title,omitempty"` // Movie
	Name             string       `json:"name,omitempty"`
	OriginalTitle    string       `json:"original_title,omitempty"`
	OriginalName     string       `json:"original_name,omitempty"`
	Overview         string       `json:"overview,omitempty"`
	Popularity       float64      `json:"popularity,omitempty"`
	PosterPath       string       `json:"poster_path,omitempty"`
	Seasons          []TMDBSeason `json:"seasons,omitempty"`
	ReleaseDate      string       `json:"release_date,omitempty"` // Movie
	Tagline          string       `json:"tagline,omitempty"`
	Type             string       `json:"type,omitempty"`
	VoteAverage      float64      `json:"vote_average,omitempty"`
	VoteCount        uint         `json:"vote_count,omitempty"`
	AggregateCredits Credit       `json:"aggregate_credits"`
	Credits          Credit       `json:"credits"`
}
type Credit struct {
	Cast []People `json:"cast"`
	Crew []People `json:"crew"`
}
type Creator struct {
	Id          uint   `json:"id,omitempty"`
	CreditId    string `json:"credit_id,omitempty"`
	Name        string `json:"name,omitempty"`
	Gender      uint   `json:"gender,omitempty"`
	ProfilePath string `json:"profile_path,omitempty"`
}
type TMDBSeason struct {
	Id           uint      `json:"id,omitempty"`
	ShowName     string    `json:"show_name,omitempty"`
	Name         string    `json:"name,omitempty"`
	Episodes     []Episode `json:"episodes,omitempty"`
	AirDate      string    `json:"air_date,omitempty"`
	Overview     string    `json:"overview,omitempty"`
	PosterPath   string    `json:"poster_path,omitempty"`
	SeasonNumber uint      `json:"season_number,omitempty"`
	VoteAverage  float64   `json:"vote_average,omitempty"`
	SeriesID     uint      `json:"series_id,omitempty"`
}
type Episode struct {
	Id            int      `json:"id,omitempty"`
	Name          string   `json:"name,omitempty"`
	Overview      string   `json:"overview,omitempty"`
	AirDate       string   `json:"air_date,omitempty"`
	EpisodeNumber int      `json:"episode_number,omitempty"`
	EpisodeType   string   `json:"episode_type,omitempty"`
	Runtime       int      `json:"runtime,omitempty"`
	SeasonNumber  int      `json:"season_number,omitempty"`
	ShowId        int      `json:"show_id,omitempty"`
	StillPath     string   `json:"still_path,omitempty"`
	VoteAverage   float64  `json:"vote_average,omitempty"`
	VoteCount     int      `json:"vote_count,omitempty"`
	Crew          []People `json:"crew,omitempty"`
	GuestStars    []People `json:"guest_stars,omitempty"`
}

type People struct {
	Character          string  `json:"character,omitempty"`
	Job                string  `json:"job,omitempty"`
	Department         string  `json:"department,omitempty"`
	CreditId           string  `json:"credit_id,omitempty"`
	Order              int     `json:"order,omitempty"`
	Adult              bool    `json:"adult,omitempty"`
	Gender             int     `json:"gender,omitempty"`
	Id                 int     `json:"id,omitempty"`
	KnownForDepartment string  `json:"known_for_department,omitempty"`
	Name               string  `json:"name,omitempty"`
	OriginalName       string  `json:"original_name,omitempty"`
	Popularity         float64 `json:"popularity,omitempty"`
	ProfilePath        string  `json:"profile_path,omitempty"`
	Roles              []Role  `json:"roles"`
	Jobs               []Job   `json:"Jobs"`
}
type Role struct {
	Character    string `json:"character,omitempty"`
	EpisodeCount uint   `json:"episode_count,omitempty"`
}

type Job struct {
	Job          string `json:"job,omitempty"`
	EpisodeCount uint   `json:"episode_count,omitempty"`
}

func (item *MediaItem) GetDate() string {
	date := item.ReleaseDate
	if date == "" {
		date = item.AirDate
	}
	if len(date) >= 4 {
		return date[:4]
	}
	return "N/A"
}
func (item *TMDBDetail) GetDate() string {
	date := item.ReleaseDate
	if date == "" {
		date = item.AirDate
	}
	if len(date) >= 4 {
		return date[:4]
	}
	return "N/A"
}
func (item *TMDBSeason) GetDate() string {
	date := item.AirDate
	if len(date) >= 4 {
		return date[:4]
	}
	return "N/A"
}
func (item *TMDBDetail) GetMediaType() MediaType {
	if item.Title != "" {
		return "movie"
	}
	if item.Name != "" {
		return "tv"
	}
	return "movie"
}
func (item *TMDBSeason) GetMediaType() MediaType {
	return "tv"
}

func (item *TMDBSeason) GetName() string {
	if item.ShowName != "" {
		return item.ShowName
	} else if item.Name != "" {
		return item.Name
	}
	return "Unknown Title"
}

func (item *MediaItem) GetOriName() string {
	if item.OriginalTitle != "" {
		return item.OriginalTitle
	}
	if item.OriginalName != "" {
		return item.OriginalName
	}
	return "Unknown Title"
}
func (item *MediaItem) GetName() string {
	if item.Title != "" {
		return item.Title
	}
	if item.Name != "" {
		return item.Name
	}
	return "Unknown Title"
}
func (item *TMDBDetail) GetName() string {
	if item.Title != "" {
		return item.Title
	}
	if item.Name != "" {
		return item.Name
	}
	return "Unknown Title"
}

func (item *TMDBDetail) GetCredits() Credit {
	if !reflect.DeepEqual(item.Credits, Credit{}) {
		return item.Credits
	}
	if !reflect.DeepEqual(item.AggregateCredits, Credit{}) {
		return item.AggregateCredits
	}
	return Credit{}
}
func (people *People) GetRole() string {
	if people.Character != "" {
		return people.Character
	} else if people.Job != "" {
		return people.Job
	} else if len(people.Roles) > 0 && people.Roles[0].Character != "" {
		return people.Roles[0].Character
	} else if len(people.Jobs) > 0 && people.Jobs[0].Job != "" {
		return people.Jobs[0].Job
	}
	return "Crew"
}
