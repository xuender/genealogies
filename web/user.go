package web

import (
	"encoding/json"
	"errors"
	"github.com/martini-contrib/sessions"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

// 修改密码
type Password struct {
	Password string `form:"password" binding:"required"`
	Old      string `form:"old" binding:"required"`
}

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
	Ca time.Time `bson:"ca,omitempty"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty"`
	// 有效标记
	En bool
}

// 用户禁用
func (u *User) Disable() {
	u.En = false
	u.Save()
}

// 保存
func (u *User) Save() error {
	c := DB.C("user")
	if u.Ca.IsZero() {
		u.Ca = time.Now()
		return c.Insert(u)
	}
	u.Ua = time.Now()
	return c.UpdateId(u.Id, u)
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
	l := Log{
		Uid:  user.Id,
		Work: "注册",
	}
	l.Create()
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
	l := Log{
		Uid:  user.Id,
		Work: "登录",
	}
	l.Create()
	return string(res)
}

// 获取用户信息
func UserGet(s Session) string {
	ret := make(map[string]interface{})
	ret["ok"] = true
	ret["user"] = s.User
	res, _ := json.Marshal(ret)
	return string(res)
}

// 修改密码
func UserPassword(p Password, s Session) string {
	ret := make(map[string]interface{})
	ok := p.Old == s.User.Password
	ret["ok"] = ok
	if ok {
		s.User.Password = p.Password
		s.User.Save()
	} else {
		ret["err"] = "旧密码错误"
	}
	res, _ := json.Marshal(ret)
	return string(res)
}
