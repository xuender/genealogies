package web

import (
	log "github.com/Sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"time"
	//	log "github.com/Sirupsen/logrus"
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
	Node     bson.ObjectId
	Info     bson.ObjectId
}

// 获取用户信息
func (u *User) ToInfo() string {
	info := Info{}
	c := DB.C("info")
	err := c.FindId(u.Info).One(&info)
	if err == nil {
		return info.Json()
	}
	log.WithFields(log.Fields{
		"user": u,
		"info": info,
		"err":  err,
	}).Debug("ToInfo")
	return "{}"
}

// 创建用户信息
func (u *User) Create() {
	node := Node{
		Id: bson.NewObjectId(),
		Data: Data{
			N: u.Name,
			L: true,
		},
		Ca: time.Now(),
		Cb: u.Id,
		Ua: time.Now(),
		Ub: u.Id,
	}
	u.Node = node.Id
	info := Info{
		Id: bson.NewObjectId(),
		O:  node.Id,
	}
	u.Info = info.Id
	info.Data = node.Data
	DB.C("node").Insert(&node)
	//log.WithFields(log.Fields{
	//	"error": err,
	//}).Info("node")
	DB.C("info").Insert(&info)
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
	user.Create()
	err = c.Insert(&user)
	return
}

// 根据ID查找用户
func UserFindById(id bson.ObjectId) (u User, err error) {
	c := DB.C("user")
	u = User{}
	err = c.FindId(id).One(&u)
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
