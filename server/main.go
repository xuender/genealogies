package main

import (
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
)

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		m := []string{}
		for i := 0; i < 10; i++ {
			m = append(m, uuid.NewV4().String())
		}
		c.JSON(200, gin.H{
			"message": m,
		})
	})
	r.Run() // listen and server on 0.0.0.0:8080
}
