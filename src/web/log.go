package web
import (
  "gopkg.in/mgo.v2"
  "time"
)
type Log struct {
  Msg     string
  Ca      string
}

var DB *mgo.Database
// 增加日志
func AddLog(msg string) error{
  c := DB.C("log")
  return c.Insert(
    &Log{msg, time.Now().Format("2006-01-02 15:04:05")},
  )
}
