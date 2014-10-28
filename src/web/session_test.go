package web

import (
	log "github.com/Sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"testing"
	"time"
)

func TestSessionFind(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	c := DB.C("session")
	session := Session{
		Id:  bson.NewObjectId(),
		Uid: "123",
		Ca:  time.Now(),
		Ua:  time.Now(),
		En:  true,
	}
	err := c.Insert(&session)
	if err != nil {
		log.Error(err)
		t.Errorf("增加Session失败")
	}
	_, e := SessionFind(session.Id.Hex())
	if e != nil {
		log.Error(e)
		t.Errorf("查找Session失败")
	}
}
func TestLogin(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	Register("110", "ender", "123")
	_, _, err := Login("110", "123")
	if err != nil {
		log.Error(err)
		t.Errorf("登录失败")
	}
	_, _, err = Login("110", "111")
	if err == nil {
		log.Error(err)
		t.Errorf("密码错误")
	}
	_, _, err = Login("119", "123")
	if err == nil {
		log.Error(err)
		t.Errorf("用户不存在")
	}
}
func TestLogout(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	Register("110", "ender", "123")
	session, _, _ := Login("110", "123")
	session.Logout()
	log.Info(session.Id)
	s2, err := SessionFind(session.Id.Hex())
	if err != nil {
		log.Error(err)
		t.Errorf("Session未找到")
	}
	if s2.En {
		log.Error(err)
		t.Errorf("登出失败")
	}
}
