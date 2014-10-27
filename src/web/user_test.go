package web

import (
	log "github.com/Sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

func TestRegister(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetDb(s)
	c := DB.C("user")
	c.Remove(bson.M{"phone": "110"})
	err := Register("110", "ender", "123")
	if err != nil {
		log.Error(err)
	}
	user := User{}
	err = c.Find(bson.M{"phone": "110"}).One(&user)
	if err != nil {
		t.Errorf("用户创建失败")
	}
}
func TestLogin(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetDb(s)
	Register("110", "ender", "123")
	u, err := Login("110", "123")
	if err != nil {
		log.Error(err)
		t.Errorf("登录失败")
	}
	log.Info(u.Id.Hex())
}
