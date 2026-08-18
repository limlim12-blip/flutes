package config

import (
	"fmt"
	"net/url"

	"github.com/ilyakaznacheev/cleanenv"
)

const (
	ChannelCrawlerControl string = "crawler:control"
)

type Config struct {
	HTTP        HTTPConfig  `yaml:"http"`
	DB          DBConfig    `yaml:"db"`
	Redis       RDBConfig   `yaml:"redis"`
	TorrentConf TorrentConf `yaml:"torrent"`
	APIkey      APIkey
}

type HTTPConfig struct {
	Port int `yaml:"port" env-default:"8080"`
}

type RDBConfig struct {
	Port int    `yaml:"port" env-default:"6379"`
	Host string `yaml:"host" env-default:"redis"`
}
type DBConfig struct {
	Host     string `yaml:"host" env-default:"localhost"`
	Port     int    `yaml:"port" env-default:"5432"`
	Name     string `yaml:"name" env-required:"true"`
	User     string `yaml:"user" env-required:"true"`
	Password string `yaml:"password" env-required:"true"`
	// PoolSize int    `yaml:"pool_size" env:"DB_POOL_SIZE" env-default:"10"`
}
type APIkey struct {
	TmDB string
}

type TorrentConf struct {
	ListenPort int `yaml:"listen_port" env-default:"0"`
	// add more
}

var cfg Config

func Load(configPath string) error {
	err := cleanenv.ReadConfig(configPath, &cfg)
	if err != nil {
		return fmt.Errorf("failed load config:%s", err.Error())
	}
	return nil
}
func GetConfig() Config {
	return cfg
}
func (c DBConfig) DSN() string {
	u := url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(c.User, c.Password),
		Host:   fmt.Sprintf("%s:%d", c.Host, c.Port),
		Path:   c.Name,
	}

	q := u.Query()
	q.Set("sslmode", "disable")
	q.Set("options", "-c pg_trgm.similarity_threshold=0.5")
	u.RawQuery = q.Encode()

	return u.String()
}
