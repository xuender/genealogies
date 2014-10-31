package main

import (
	"./web"
)

func main() {
	s := web.Connect()
	web.DB = web.GetDb(s)
	defer s.Close()
	web.Register("110", "ender", "123")
}
