package web

import (
	"../base"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

// Session查找
func TestSessionFind(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	u := User{
		Phone: "110",
	}
	u.Create()
	n := Session{
		Uid: u.Id,
	}
	n.Create()
	m := Session{}
	e := m.Find(n.Id.Hex())
	if e != nil {
		t.Errorf("查找会话失败")
	}
	if m.User.Phone != "110" {
		t.Errorf("用户信息错误")
	}
}

// session 创建
func TestSessionCreate(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	uid := bson.NewObjectId()
	n := Session{
		Uid: uid,
	}
	err := n.Create()
	if err != nil {
		t.Errorf("创建会话失败")
	}
	if n.Uid != uid {
		t.Errorf("用户ID错误")
	}
}
