package logger

import (
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Log *zap.Logger
var DefaultLog *zap.Logger

var Sugar *zap.SugaredLogger

func Init(d bool) {
	DefaultLog, _ = zap.NewProduction()

	encoderConfig := zap.NewDevelopmentEncoderConfig()

	// 1. Color the Level (Red for ERROR, Blue for INFO, etc.)
	encoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder

	vietnamTZ := time.FixedZone("ICT", 7*3600)
	encoderConfig.EncodeTime = func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
		vnTime := t.In(vietnamTZ).Format("2006-01-02 15:04:05.000")
		enc.AppendString("\x1b[36m" + vnTime + "\x1b[0m")
	}

	encoderConfig.EncodeCaller = func(caller zapcore.EntryCaller, enc zapcore.PrimitiveArrayEncoder) {
		enc.AppendString("\x1b[95m" + caller.TrimmedPath() + "\x1b[0m")
	}
	f, err := os.OpenFile("./logs/app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	consoleEncoder := zapcore.NewConsoleEncoder(encoderConfig)
	level := zap.InfoLevel
	if d {
		level = zap.DebugLevel
	}
	core := zapcore.NewTee(
		// zapcore.NewCore(consoleEncoder, zapcore.AddSync(os.Stdout), level),
		zapcore.NewCore(consoleEncoder, zapcore.AddSync(f), level),
	)

	Log = zap.New(core,
		zap.AddCaller(),
		zap.AddStacktrace(zapcore.ErrorLevel),
	)

	Sugar = Log.Sugar()
}
