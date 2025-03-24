package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go-movies-api/models"
	"go-movies-api/services"
	"go-movies-api/utils"
	"net/http"
	"path/filepath"
	"strconv"
)

func GetAllMovies(c *gin.Context) {
	movie, err := services.GetAllMovies()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movie)
}

func GetMovieById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID is invalid!"})
		return
	}

	movie, err := services.GetMovieById(id)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie does not exist with the given ID!"})
		return
	}

	c.JSON(http.StatusOK, movie)
}

func CreateMovie(c *gin.Context) {
	var movie models.Movie

	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := services.CreateMovie(&movie); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, movie)
}

func DeleteMovieById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID is invalid!"})
		return
	}

	if err := services.DeleteMovie(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Movie has been deleted!"})
}

func UpdateMovieById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID is invalid!"})
		return
	}

	var updatedData map[string]interface{}
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie, err := services.UpdateMovie(id, updatedData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movie)
}

func UploadMovieImage(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID is invalid!"})
		return
	}

	_, err = services.GetMovieById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie does not exist with the given ID!"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded!"})
		return
	}

	fileExt := filepath.Ext(file.Filename)
	uniqueFilename := fmt.Sprintf("img_%s%s", utils.GenerateRandomString(16), fileExt)
	filePath := fmt.Sprintf("uploads/%s", uniqueFilename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file!"})
		return
	}

	updatedMovie, err := services.UpdateMovieImage(id, filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedMovie)
}
