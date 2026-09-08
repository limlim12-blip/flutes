package models

type CrawlerControlUri struct {
	Action Controler `uri:"action" binding:"required,oneof=start stop"`
}
