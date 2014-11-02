package main

import (
	"./web"
)

func main() {
	s := web.Connect()
	web.DB = web.GetDb(s)
	defer s.Close()
	web.DB.DropDatabase()
	u, _ := web.Register("110", "ender", "123")
	n, _ := web.NodeFind(u.Node)
	n.Add("f")
	u.ToInfo()
}
