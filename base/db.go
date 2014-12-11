package base

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

// 连接
func Connect(ip string) *mgo.Session {
	s, err := mgo.Dial(ip)
	if err != nil {
		log.Fatal("数据库连接失败")
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
func GetTest2Db(s *mgo.Session) *mgo.Database {
	return s.DB("test2")
}

type Base struct {
	// 有效标记
	En bool `bson:"en,omitempty"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty"`
	// 创建人
	Cb bson.ObjectId `bson:"cb,omitempty"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty"`
	// 修改人
	Ub bson.ObjectId `bson:"ub,omitempty"`
}
