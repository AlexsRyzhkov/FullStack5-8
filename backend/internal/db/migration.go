package db

import (
	"exmaple/internal/model"
	"gorm.io/gorm"
	"log"
)

func Migration(database *gorm.DB) {
	err := database.AutoMigrate(
		&model.User{},
		&model.Task{},
	)
	if err != nil {
		log.Fatal("Error Migration")
	}
}
