package utils

import (
	"bufio"
	"context"
	_ "embed"
	"fmt"
	"net/url"
	"strings"
)

//go:embed tracker.txt
var trackerFileContent string // NOTE: handy compile time read file

func GetTracker() string {
	var sb strings.Builder
	scanner := bufio.NewScanner(strings.NewReader(trackerFileContent))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line != "" {
			sb.WriteString("&tr=")
			sb.WriteString(url.QueryEscape(line))
		}
	}
	return sb.String()
}
func FormatBytes(b int64) string {
	const unit = 1024
	exp := 1
	for ; b >= unit*unit; b /= unit {
		exp++
	}
	return fmt.Sprintf("%.2f %cB", float64(b)/1024, " KMGT"[min(exp, 3)])
}

//go:fix inline
func Ptr[T any](v T) *T { return new(v) }
func MergeContext(ctx1, ctx2 context.Context) (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		select {
		case <-ctx1.Done():
			cancel()
		case <-ctx2.Done():
			cancel()
		case <-ctx.Done():
			return
		}
	}()

	return ctx, cancel

}
