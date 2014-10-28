package web

import (
	"gopkg.in/mgo.v2"
)

// 连接
func Connect() *mgo.Session {
	s, err := mgo.Dial("127.0.0.1")
	if err != nil {
		panic("数据库连接失败")
	}
	s.SetMode(mgo.Monotonic, true)
	return s
}

// 获取数据库连接
func GetDb(s *mgo.Session) *mgo.Database {
	return s.DB("go")
}

// 获取测试数据库
func GetTestDb(s *mgo.Session) *mgo.Database {
	return s.DB("test")
}
