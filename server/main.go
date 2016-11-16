package main

import (
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
	"./utils"
	"./safe"
	"os"
	"log"
)

var stdlog, errlog *log.Logger

func init() {
	stdlog = log.New(os.Stdout, "", log.Ldate | log.Ltime)
	errlog = log.New(os.Stderr, "", log.Ldate | log.Ltime)
}

func run() {
	r := gin.Default()
	white := &safe.White{}
	white.AddName = "/white"
	r.Use(white.Filter())
	r.GET("/", func(c *gin.Context) {
		m := []string{}
		for i := 0; i < 10; i++ {
			m = append(m, uuid.NewV4().String())
		}
		c.JSON(200, gin.H{
			"message": m,
		})
	})
	r.GET(white.AddName, white.Add)
	r.Run() // listen and server on 0.0.0.0:8080
}

func main() {
	service := &utils.Service{"dtest", "test service", run};
	status, err := service.Manage()
	if err != nil {
		errlog.Println(status, "\nError: ", err)
		os.Exit(1)
	}
	stdlog.Println(status)
}
