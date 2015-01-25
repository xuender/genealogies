package main

import (
	"./base"
	"log"
)

func a(t ...string) {
	for _, i := range t {
		log.Println(i)
	}
}

func main() {
	base.LogDev()
	log.Println("启动")
	b := []string{"aa", "bb", "cc"}
	a(b...)
}
