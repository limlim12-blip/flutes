package config

import (
	"fmt"
	"net/url"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	HTTP   HTTPConfig `yaml:"http"`
	DB     DBConfig   `yaml:"db"`
	Redis  RDBConfig  `yaml:"redis"`
	APIkey APIkey
}

type HTTPConfig struct {
	Port int `yaml:"port" env-default:"8080"`
}

type RDBConfig struct {
	Port int    `yaml:"port" env-default:"8080"`
	Host string `yaml:"host" env-default:"redis"`
}
type DBConfig struct {
	Host     string `yaml:"host" env-default:"db"`
	Port     int    `yaml:"port" env-default:"5432"`
	Name     string `yaml:"name" env-required:"true"`
	User     string `yaml:"user" env-required:"true"`
	Password string `yaml:"password" env-required:"true"`
	// PoolSize int    `yaml:"pool_size" env:"DB_POOL_SIZE" env-default:"10"`
}
type APIkey struct {
	TmDB string `env:"TMDB_API_KEY" env-required:"true"`
}

var cfg *Config = nil

func Load(configPath string) error {
	if cfg != nil {
		return fmt.Errorf("cannot reinit config, only load config once")
	}
	err := cleanenv.ReadConfig(configPath, &cfg)
	if err != nil {
		return fmt.Errorf("failed load config")
	}
	return nil
}
func GetConfig() Config {
	return *cfg
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
