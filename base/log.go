package base

import (
	"log"
	"os"
)

// 运行模式
func LogInit(file string) {
	log.SetFlags(log.Lshortfile | log.LstdFlags)
	f, _ := os.OpenFile(file, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	log.SetOutput(f)
}

// 开发模式
func LogDev() {
	log.SetFlags(log.Lshortfile | log.LstdFlags)
}
