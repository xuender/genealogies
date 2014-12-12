package web

import (
	"encoding/json"
	"errors"
	"github.com/martini-contrib/sessions"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

// 用户
type User struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 手机
	Phone string `form:"phone" binding:"required"`
	// 姓名
	Name string
	// 密码
	Password string `form:"password" binding:"required"`
	// 是否是管理员
	IsManager bool
	// 创建时间
	Ca time.Time
	// 修改时间
	Ua time.Time
	// 有效标记
	En bool
}

// 用户禁用
func (u *User) Disable() {
	u.En = false
	// TODO 保存
}

// 根据ID查找
func (u *User) Find(uid bson.ObjectId) error {
	return DB.C("user").FindId(uid).One(u)
}

// 用户根据手机号查找
func (u *User) FindByPhone(phone string) error {
	return DB.C("user").Find(bson.M{"phone": phone}).One(u)
}

// 用户创建
func (u *User) Create() (err error) {
	c := DB.C("user")
	err = u.FindByPhone(u.Phone)
	if err == nil {
		return errors.New("手机" + u.Phone + "已经注册")
	}
	u.Id = bson.NewObjectId()
	u.Ca = time.Now()
	u.En = true
	u.IsManager = false
	err = c.Insert(u)
	return
}

// 用户登录
func UserLogin(session sessions.Session, user User) string {
	ret := make(map[string]interface{})
	ret["ok"] = false
	log.Printf("手机登陆:%s\n", user.Phone)
	u := User{}
	err := u.FindByPhone(user.Phone)
	if err != nil {
		err = errors.New("手机号" + user.Phone + "未找到，没有注册")
		ret["err"] = "手机号" + user.Phone + "未找到，没有注册"
		res, _ := json.Marshal(ret)
		return string(res)
	}
	s := Session{
		Uid: u.Id,
	}
	err = s.Create()
	if err != nil {
		ret["err"] = err.Error()
		res, _ := json.Marshal(ret)
		return string(res)
	}
	ret["ok"] = true
	session.Set("id", s.Id.Hex())
	ret["id"] = s.Id.Hex()
	ret["user"] = u
	res, _ := json.Marshal(ret)
	log.Printf("用户 [ %s ] 登录成功\n", u.Name)
	return string(res)
}
