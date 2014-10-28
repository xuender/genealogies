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
	Password string `json:"-"`
	Ca       time.Time
}

// 注册
func Register(phone, name, password string) (user User, err error) {
	c := DB.C("user")
	user = User{}
	err = c.Find(bson.M{"phone": phone}).One(&user)
	if err == nil {
		return user, errors.New("手机" + phone + "已经注册")
	}
	user = User{
		Id:       bson.NewObjectId(),
		Phone:    phone,
		Name:     name,
		Password: password,
		Ca:       time.Now(),
	}
	AddLog("register", name)
	err = c.Insert(&user)
	return
}

// 根据ID查找用户
func UserFindById(id string) (u User, err error) {
	c := DB.C("user")
	u = User{}
	err = c.FindId(bson.ObjectIdHex(id)).One(&u)
	return
}

// 用户查找
func UserFind(phone string) (User, error) {
	c := DB.C("user")
	user := User{}
	err := c.Find(bson.M{"phone": phone}).One(&user)
	return user, err
}

//// 登录
//func Login(phone, password string) (User, error) {
//  c := DB.C("user")
//  user := User{}
//  err := c.Find(bson.M{"phone": phone}).One(&user)
//  if err != nil {
//    return user, errors.New("手机" + phone + "未注册")
//  }
//  if user.Password != password {
//    return user, errors.New("密码错误")
//  }
//  AddLog("login", user.Name)
//  return user, nil
//}
