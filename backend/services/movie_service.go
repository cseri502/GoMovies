package services

import (
	"errors"
	"go-movies-api/initializers"
	"go-movies-api/models"
	"os"
	"strings"
)

func GetAllMovies() ([]models.Movie, error) {
	var movies []models.Movie

	result := initializers.DB.Find(&movies)

	return movies, result.Error
}

func GetMovieById(id int) (*models.Movie, error) {
	var movie models.Movie

	result := initializers.DB.First(&movie, id)

	if result.Error != nil {
		return nil, errors.New("The movie does not exist")
	}

	return &movie, result.Error
}

func CreateMovie(movie *models.Movie) error {
	result := initializers.DB.Create(&movie)
	return result.Error
}

func DeleteMovie(id int) error {
	movie, err := GetMovieById(id)
	if err != nil {
		return err
	}

	if movie.ImageURL != "" {
		deleteImageFile(movie.ImageURL)
	}

	result := initializers.DB.Delete(&models.Movie{}, id)

	if result.RowsAffected == 0 {
		return errors.New("The movie does not exist")
	}

	return nil
}

func UpdateMovie(id int, updatedData map[string]interface{}) (*models.Movie, error) {
	var movie models.Movie

	result := initializers.DB.First(&movie, id)
	if result.Error != nil {
		return nil, errors.New("The movie does not exist")
	}

	result = initializers.DB.Model(&movie).Updates(updatedData)
	if result.Error != nil {
		return nil, result.Error
	}

	return &movie, nil
}

func UpdateMovieImage(id int, filePath string) (*models.Movie, error) {
	var movie models.Movie

	result := initializers.DB.First(&movie, id)
	if result.Error != nil {
		return nil, errors.New("The movie does not exist")
	}

	if movie.ImageURL != "" && movie.ImageURL != filePath {
		err := deleteImageFile(movie.ImageURL)
		if err != nil {
			return nil, err
		}
	}

	movie.ImageURL = filePath
	initializers.DB.Save(&movie)

	return &movie, nil
}

func deleteImageFile(filePath string) error {
	if !strings.HasPrefix(filePath, "uploads/") {
		return errors.New("Invalid image path")
	}

	err := os.Remove(filePath)
	if err != nil && !os.IsNotExist(err) {
		return err
	}

	return nil
}
