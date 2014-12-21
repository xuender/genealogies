package web

import (
	"../base"
	"testing"
)

// 用户禁用
func TestUserDisable(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
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
	u.New()
	user := User{
		Id: u.Id,
	}
	err := user.Find()
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
	user := User{
		Phone: "110",
	}
	err := user.Find()
	if err != nil {
		t.Errorf("查找失败")
	}
	if user.Phone != "110" {
		t.Errorf("手机错误")
	}
	u2 := User{
		Phone: "112",
	}
	err = u2.Find()
	if err == nil {
		t.Errorf("未找到应提示错误")
	}
}

// 用户创建
func TestUserNew(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	u := User{
		Phone: "110",
	}
	err := u.New()
	if err != nil {
		t.Errorf("创建用户失败")
	}
	if !u.En {
		t.Errorf("新用户有效状态错误")
	}
	r := User{
		Phone: "110",
	}
	err = r.Find()
	if err != nil {
		t.Errorf("创建用户未找到")
	}
	err = r.New()
	if err == nil {
		t.Errorf("重复手机未找到")
	}
}

// 用户保存
func TestUserSave(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	u := User{
		Phone: "110",
	}
	u.New()
	u.Phone = "123"
	err := u.Save()
	if err != nil {
		t.Errorf(err.Error())
	}
	o := User{
		Id: u.Id,
	}
	o.Find()
	if o.Phone != "123" {
		t.Errorf("修改错误:%s", o.Phone)
	}
}
