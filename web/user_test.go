package web

import (
	"../base"
	"testing"
)

// 用户禁用
func TestUserDisable(t *testing.T) {
	var u User
	u.En = true
	u.Disable()
	if u.En {
		t.Errorf("禁用失败")
	}
}
func TestUserFind(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	u := User{
		Phone: "110",
	}
	u.Create()
	user := User{
		Phone: "110",
	}
	err := user.Find(u.Id)
	if err != nil {
		t.Errorf("查找失败")
	}
}
func TestUserFindByPhone(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	c := DB.C("user")
	u := User{
		Phone: "110",
	}
	c.Insert(&u)
	user := User{}
	err := user.FindByPhone("110")
	if err != nil {
		t.Errorf("查找失败")
	}
	if user.Phone != "110" {
		t.Errorf("手机错误")
	}
	err = user.FindByPhone("112")
	if err == nil {
		t.Errorf("未找到应提示错误")
	}
}

// 用户创建
func TestUserCreate(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	u := User{
		Phone: "110",
	}
	err := u.Create()
	if err != nil {
		t.Errorf("创建用户失败")
	}
	if !u.En {
		t.Errorf("新用户有效状态错误")
	}
	r := User{}
	err = r.FindByPhone("110")
	if err != nil {
		t.Errorf("创建用户未找到")
	}
	err = r.Create()
	if err == nil {
		t.Errorf("重复手机未找到")
	}
}
