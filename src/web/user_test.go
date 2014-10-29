package web

import (
	log "github.com/Sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

func TestRegister(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	c := DB.C("user")
	c.Remove(bson.M{"phone": "110"})
	_, err := Register("110", "ender", "123")
	if err != nil {
		log.Error(err)
	}
	user := User{}
	err = c.Find(bson.M{"phone": "110"}).One(&user)
	if err != nil {
		t.Errorf("用户创建失败")
	}
}

func TestUserFindById(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	u, _ := Register("110", "ender", "123")
	user, err := UserFindById(u.Id)
	if err != nil {
		t.Errorf("用户查找失败")
	}
	if user.Phone != "110" {
		t.Errorf("用户手机错误")
	}
}
func TestUserFind(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	c := DB.C("user")
	c.Remove(bson.M{"phone": "110"})
	_, err := Register("110", "ender", "123")
	if err != nil {
		t.Errorf("用户创建失败")
	}
	_, e := UserFind("110")
	if e != nil {
		t.Errorf("用户查询失败")
	}
}
