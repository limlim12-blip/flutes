package crawler

import (
	"path/filepath"
	"regexp"
	"strings"
)

var blockedContentRegex = regexp.MustCompile(`(?i)(無修正|アダルト|エロ|ポルノ|AV女優|盗撮|素人|人妻|巨乳|痴漢|熟女|モザイク破壊|FC2-PPV|FC2PPV|Caribbeancom|1pondo|10musume|Heydouga|pacopacomama|色情|无码|有码|步兵|骑兵|女优|三级片|乱伦|强奸|轮奸|偷拍|淫秽|萝莉|porn|xxx|anal|nsfw|uncensored|jav|milf|gangbang|boudoir|playboy|penthouse|brazzers|realitykings|naughtyamerica|repack|cracked|keygen|patch|activation|trainer|flac|discography|album|cbr|cbz|android|apk|ios|windows|crack|window|macos)`)

func isBlocked(path string) bool {
	return blockedContentRegex.MatchString(path) || blockedContentRegex.MatchString(path)
}
func hasBannedExtension(path string) bool {
	ext := strings.ToLower(filepath.Ext(path))
	switch ext {
	case ".exe", ".lnk", ".scr", ".zip", ".bat", ".cmd", ".msi", ".rar", ".7z", ".dmg":
		return true
	default:
		return false
	}
}
