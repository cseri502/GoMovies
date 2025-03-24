package routes

import (
	"github.com/gin-gonic/gin"
	"go-movies-api/controllers"
)

func RegisterRoutes(e *gin.Engine) {
	movies := e.Group("/movies")
	{
		movies.GET("/", controllers.GetAllMovies)
		movies.GET("/:id", controllers.GetMovieById)
		movies.POST("/", controllers.CreateMovie)
		movies.DELETE("/:id", controllers.DeleteMovieById)
		movies.PUT("/:id", controllers.UpdateMovieById)
		movies.POST("/:id/upload", controllers.UploadMovieImage)
	}
}
