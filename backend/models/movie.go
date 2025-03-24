package models

import "gorm.io/gorm"

type Movie struct {
	gorm.Model
	Title    string  `json:"title" binding:"required"`
	Director string  `json:"director" binding:"required"`
	Year     int16   `json:"year" binding:"required"`
	Rating   float32 `json:"rating" binding:"required"`
	ImageURL string  `json:"image_url"`
}
