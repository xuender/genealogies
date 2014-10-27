package web

import (
	"gopkg.in/mgo.v2/bson"
	"time"
	//log "github.com/Sirupsen/logrus"
	"errors"
)

// 用户
type User struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 使用手机登录身份认证
	Phone    string
	Name     string
	Password string
	Ca       time.Time
}

// 注册
func Register(phone, name, password string) error {
	c := DB.C("user")
	user := User{}
	err := c.Find(bson.M{"phone": phone}).One(&user)
	if err == nil {
		return errors.New("手机" + phone + "已经注册")
	}
	AddLog("register", name)
	return c.Insert(
		&User{Phone: phone, Name: name, Password: password, Ca: time.Now()},
	)
}

// 登录
func Login(phone, password string) (User, error) {
	c := DB.C("user")
	user := User{}
	err := c.Find(bson.M{"phone": phone}).One(&user)
	if err != nil {
		return user, errors.New("手机" + phone + "未注册")
	}
	if user.Password != password {
		return user, errors.New("密码错误")
	}
	AddLog("login", user.Name)
	return user, nil
}
