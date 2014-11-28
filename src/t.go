package main

import (
	"./web"
)

func create() {
	s := web.Connect()
	web.DB = web.GetDb(s)
	defer s.Close()
	web.DB.DropDatabase()
	u, _ := web.Register("110", "ender", "123")
	u.ToInfo()
}

func main() {
	create()
}
