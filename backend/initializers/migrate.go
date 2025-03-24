package initializers

import (
	"go-movies-api/models"
)

func Migrate() {
	DB.AutoMigrate(&models.Movie{})
}
