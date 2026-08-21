package service

type TMDBResponse struct {
	Page         uint        `json:"page,omitempty"`
	Results      []MediaItem `json:"results,omitempty"`
	TotalPages   uint        `json:"total_pages,omitempty"`
	TotalResults uint        `json:"total_results,omitempty"`
}

// A mix of all
type MediaItem struct {
	Adult              bool        `json:"adult,omitempty"`
	BackdropPath       string      `json:"backdrop_path,omitempty"`
	ID                 uint        `json:"id,omitempty"`
	Title              string      `json:"title,omitempty"` // Movie
	Name               string      `json:"name,omitempty"`  // TV People
	OriginalLanguage   string      `json:"original_language,omitempty"`
	OriginalTitle      string      `json:"original_title,omitempty"`
	OriginalName       string      `json:"original_name,omitempty"` // TV
	Overview           string      `json:"overview,omitempty"`
	PosterPath         string      `json:"poster_path,omitempty"`
	MediaType          string      `json:"media_type,omitempty"`
	GenreIDs           []uint      `json:"genre_ids,omitempty"`
	Popularity         float64     `json:"popularity,omitempty"`
	FirstAirDate       string      `json:"first_air_date,omitempty"` // TV
	ReleaseDate        string      `json:"release_date,omitempty"`   // Movie
	VoteAverage        float64     `json:"vote_average,omitempty"`
	VoteCount          uint        `json:"vote_count,omitempty"`
	KnownForDepartment string      `json:"known_for_department,omitempty"` // People
	ProfilePath        string      `json:"profile_path,omitempty"`         //People
	KnownFor           []MediaItem `json:"known_for,omitempty"`            // People
}

type TmdbQuery struct {
	Page     uint   `form:"page,default=1"`
	Query    string `form:"query"`
	Order    string `form:"order,default=ASC"`
	Language string `form:"language,default=en-US"`
}
type UriParams struct {
	Type   string `uri:"type" binding:"required,oneof=movie tv pesron multi"`
	ID     uint   `uri:"id" binding:"omitempty,gte=0"`
	Season uint   `uri:"season_number" binding:"omitempty"`
}

type MediaTrendingUriParams struct {
	Type       string `uri:"type" binding:"oneof=movie tv pesron all"`
	TimeWindow string `uri:"time_window" binding:"required,oneof=day week"`
}
type Genre struct {
	Id   uint
	Name string
}
type TMDBTvSeries struct {
	Id               uint         `json:"id,omitempty"`
	CreatedBy        []Creator    `json:"created_by"`
	FirstAirDate     string       `json:"first_air_date,omitempty"`
	BackdropPath     string       `json:"backdrop_path,omitempty"`
	Genres           []Genre      `json:"genres,omitempty"`
	Homepage         string       `json:"homepage,omitempty"`
	Languages        []string     `json:"languages,omitempty"`
	Name             string       `json:"name,omitempty"`
	NumberOfEpisodes uint         `json:"number_of_episodes,omitempty"`
	NumberOfSeasons  uint         `json:"number_of_seasons,omitempty"`
	OriginCountry    []string     `json:"origin_country,omitempty"`
	OriginalLanguage string       `json:"original_language,omitempty"`
	OriginalName     string       `json:"original_name,omitempty"`
	Overview         string       `json:"overview,omitempty"`
	Popularity       float64      `json:"popularity,omitempty"`
	PosterPath       string       `json:"poster_path,omitempty"`
	Seasons          []TMDBSeason `json:"seasons,omitempty"`
	Tagline          string       `json:"tagline,omitempty"`
	Type             string       `json:"type,omitempty"`
	VoteAverage      float64      `json:"vote_average,omitempty"`
	VoteCount        uint         `json:"vote_count,omitempty"`
	AggregateCredits Credit       `json:"aggregate_credits"`
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
}
type Role struct {
	Character    string `json:"character,omitempty"`
	Job          string `json:"job,omitempty"`
	EpisodeCount uint   `json:"episode_count,omitempty"`
}
