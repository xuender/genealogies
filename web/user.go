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

// 查找用户
func (u *User) Find() error {
	c := DB.C("user")
	if u.Id.Valid() {
		return c.FindId(u.Id).One(u)
	}
	if u.Phone != "" {
		return c.Find(bson.M{"phone": u.Phone}).One(u)
	}
	return errors.New("条件不具足，无法查找.")
}

// 用户创建
func (u *User) Create() (err error) {
	c := DB.C("user")
	err = u.Find()
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

// 用户注册
func UserRegister(session sessions.Session, user User) string {
	ret := make(map[string]interface{})
	ret["ok"] = false
	log.Printf("手机注册:%s\n", user.Phone)
	u := User{
		Phone: user.Phone,
	}
	err := u.Find()
	if err == nil {
		ret["err"] = "手机号" + user.Phone + "已经使用，不能注册"
		res, _ := json.Marshal(ret)
		return string(res)
	}
	err = user.Create()
	if err != nil {
		ret["err"] = err.Error()
		res, _ := json.Marshal(ret)
		return string(res)
	}
	return login(user, session)
}

// 用户登录
func UserLogin(session sessions.Session, user User) string {
	ret := make(map[string]interface{})
	ret["ok"] = false
	log.Printf("手机登陆:%s\n", user.Phone)
	u := User{
		Phone: user.Phone,
	}
	err := u.Find()
	if err != nil {
		ret["err"] = "手机号" + user.Phone + "未找到，没有注册"
		res, _ := json.Marshal(ret)
		return string(res)
	}
	if u.Password != user.Password {
		ret["err"] = "密码错误"
		res, _ := json.Marshal(ret)
		return string(res)
	}
	return login(u, session)
}

// 用户登出
func UserLogout(session sessions.Session) string {
	id := session.Get("id").(string)
	log.Printf("读取Session:%s\n", id)
	s := Session{
		Id: bson.ObjectIdHex(id),
	}
	err := s.Find()
	if err == nil {
		s.Logout()
		session.Delete("id")
	}
	return "ok"
}

// 登录
func login(user User, session sessions.Session) string {
	ret := make(map[string]interface{})
	ret["ok"] = false
	s := Session{
		Uid: user.Id,
	}
	err := s.Create()
	if err != nil {
		ret["err"] = err.Error()
		res, _ := json.Marshal(ret)
		return string(res)
	}
	ret["ok"] = true
	session.Set("id", s.Id.Hex())
	ret["id"] = s.Id.Hex()
	ret["user"] = user
	res, _ := json.Marshal(ret)
	log.Printf("用户 [ %s ] 登录成功\n", user.Name)
	return string(res)
}

// 获取用户信息
func UserGet(session sessions.Session) string {
	ret := make(map[string]interface{})
	ret["ok"] = false
	if session.Get("id") == nil {
		ret["err"] = "尚未登录"
		res, _ := json.Marshal(ret)
		return string(res)
	}
	id := session.Get("id").(string)
	log.Printf("读取Session:%s\n", id)
	s := Session{
		Id: bson.ObjectIdHex(id),
	}
	err := s.Find()
	ret["ok"] = (err == nil)
	if err == nil {
		ret["user"] = s.User
	} else {
		ret["err"] = err.Error()
	}
	res, _ := json.Marshal(ret)
	return string(res)
}
