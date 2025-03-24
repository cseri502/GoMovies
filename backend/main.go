package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go-movies-api/initializers"
	"go-movies-api/routes"
	"log"
)

func init() {
	initializers.Connect()
	initializers.Migrate()
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	routes.RegisterRoutes(router)
	router.Static("/uploads", "./uploads")

	err := router.Run(":8080")

	if err != nil {
		log.Fatal("Could not run application:", err)
	}
}
