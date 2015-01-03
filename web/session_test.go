package web

import (
	"../base"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

// Session查找
func TestSessionFind(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	u := User{
		Phone: "110",
	}
	u.New()
	n := Session{
		Uid: u.Id,
	}
	n.New()
	m := Session{
		Id: n.Id,
	}
	e := m.Find()
	if e != nil {
		t.Errorf("查找会话失败")
	}
	if m.User.Phone != "110" {
		t.Errorf("用户信息错误")
	}
}

// session 创建
func TestSessionNew(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	uid := bson.NewObjectId()
	n := Session{
		Uid: uid,
	}
	err := n.New()
	if err != nil {
		t.Errorf("创建会话失败")
	}
	if n.Uid != uid {
		t.Errorf("用户ID错误")
	}
}
