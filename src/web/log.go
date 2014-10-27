package web

import (
	"gopkg.in/mgo.v2"
	"time"
)

type Log struct {
	Name string
	Msg  string
	Ca   string
}

var DB *mgo.Database

// 增加日志
func AddLog(name, msg string) error {
	c := DB.C("log")
	return c.Insert(
		&Log{name, msg, time.Now().Format("2006-01-02 15:04:05")},
	)
}
