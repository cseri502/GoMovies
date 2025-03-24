package initializers

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func Connect() {
	var err error

	DB, err = gorm.Open(sqlite.Open("movies.db"), &gorm.Config{})

	if err != nil {
		log.Fatal("Could not establish database connection!", err)
	}
}
