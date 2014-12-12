package web

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 会话
type Session struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 当前用户
	Uid bson.ObjectId `bson:"uid,omitempty"`
	// 用户信息
	User User `bson:",omitempty"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty"`
}

// 会话查找
func (s *Session) Find() (err error) {
	c := DB.C("session")
	if s.Id.Valid() {
		err = c.FindId(s.Id).One(s)
		if err == nil {
			s.User.Id = s.Uid
			err = s.User.Find()
		}
	}
	return
}

// 创建会话
func (s *Session) Create() error {
	c := DB.C("session")
	s.Id = bson.NewObjectId()
	s.Ca = time.Now()
	return c.Insert(s)
}
