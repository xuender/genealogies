package web

import (
	"errors"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Session struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 当前用户
	Uid string
	// 创建时间
	Ca time.Time
	// 修改时间
	Ua time.Time
	// 有效标记
	En bool
}

// 登出
func (s *Session) Logout() {
	s.En = false
	s.Ua = time.Now()
	c := DB.C("session")
	c.UpdateId(s.Id, s)
}

// 获取Session
func SessionFind(id string) (Session, error) {
	s := Session{}
	c := DB.C("session")
	err := c.FindId(bson.ObjectIdHex(id)).One(&s)
	return s, err
}

// 登录
func Login(phone, password string) (session Session, user User, err error) {
	user, err = UserFind(phone)
	if err != nil {
		err = errors.New("手机" + phone + "未注册")
		return
	}
	if user.Password != password {
		err = errors.New("密码错误")
		return
	}
	AddLog("login", user.Name)
	c := DB.C("session")
	session = Session{
		Id:  bson.NewObjectId(),
		Uid: user.Id.Hex(),
		Ca:  time.Now(),
		Ua:  time.Now(),
		En:  true,
	}
	err = c.Insert(&session)
	return
}
