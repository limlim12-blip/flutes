package config

import (
	"fmt"
	"net/url"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Config struct {
	Ffmpeg      Ffmpeg
	HTTP        ServerConfig `yaml:"http"`
	DB          DBConfig     `yaml:"db"`
	Redis       RDBConfig    `yaml:"redis"`
	TorrentConf TorrentConf  `yaml:"torrent"`
	APIkey      APIkey       `yaml:"api" env-default:"development"`
	Env         string       `yaml:"env" env-default:"development"`
}

type ServerConfig struct {
	Port               int      `yaml:"port" env-required:"true"`
	ReadTimeout        int32    `yaml:"read_timeout" env-required:"true"`
	WriteTimeout       int32    `yaml:"write_timeout" env-required:"true"`
	IdleTimeOut        int32    `yaml:"idle_timeout" env-required:"true"`
	CORSAllowedOrigins []string `yaml:"cors_allowed_origins" env-required:"true"`
}

type RDBConfig struct {
	Port int    `yaml:"port" env-default:"6379"`
	Host string `yaml:"host" env-default:"redis"`
}
type DBConfig struct {
	Host            string `yaml:"host" env-default:"localhost"`
	Port            int    `yaml:"port" env-default:"5432"`
	Name            string `yaml:"name" env-required:"true"`
	User            string `yaml:"user" env-required:"true"`
	Password        string `yaml:"password" env-required:"true"`
	SSLMode         string `yaml:"sll_mode" env-required:"true"`
	MaxOpenConns    int32  `yaml:"max_open_conns" env-required:"true"`
	MaxIdleConns    int32  `yaml:"max_idle_conns" env-required:"true"`
	MaxConnLifeTime int32  `yaml:"max_conn_lime_time" env-required:"true"`
	MaxConnIdleTime int32  `yaml:"max_conn_idle_time" env-required:"true"`
	// PoolSize int    `yaml:"pool_size" env:"DB_POOL_SIZE" env-default:"10"`
}
type APIkey struct {
	TmDB      string `yaml:"tmdb" env:"TMDB_API_KEY"`
	WireGuard string `yaml:"wireguard_private_key" env:"WIREGUARD_PRIVATE_KEY"`
}
type Memory int64
type TorrentConf struct {
	MaxMemClient  int64 `yaml:"max_memory_client" env-default:"0"`
	MaxMemCrawler int64 `yaml:"max_memory_crawler" env-default:"0"`
	NumClient     int   `yaml:"num_client" env-default:"2"`
	// add more
}
type Ffmpeg struct {
	ChunkGap      int64
	ChunkDuration int64
}

var cfg Config

const Duration int64 = 10

func Load(configPath string) error {
	f, err := os.OpenFile("./logs/app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	consoleEncoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())

	core := zapcore.NewTee(
		zapcore.NewCore(consoleEncoder, zapcore.AddSync(os.Stdout), zap.InfoLevel),
		zapcore.NewCore(consoleEncoder, zapcore.AddSync(f), zap.InfoLevel),
	)
	Log := zap.New(core,
		zap.AddCaller(),
		zap.AddStacktrace(zapcore.ErrorLevel),
	)

	err = cleanenv.ReadConfig(configPath, &cfg)
	if err != nil {
		Log.Sugar().Fatalw("failed to load configuration", "error", err)
	}
	cfg.Ffmpeg.ChunkGap = 6
	return nil
}
func GetConfig() *Config {
	return &cfg
}
func (c DBConfig) DSN() string {
	u := url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(c.User, c.Password),
		Host:   fmt.Sprintf("%s:%d", c.Host, c.Port),
		Path:   c.Name,
	}

	q := u.Query()
	q.Set("sslmode", cfg.DB.SSLMode)
	q.Set("options", "-c pg_trgm.similarity_threshold=0.5")
	u.RawQuery = q.Encode()

	return u.String()
}
