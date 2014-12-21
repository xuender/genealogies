package web

import (
	"errors"
	"github.com/dchest/captcha"
	"github.com/martini-contrib/render"
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
func (u *User) New() (err error) {
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
func UserRegister(session sessions.Session, user Captcha, r render.Render) {
	m := Msg{Ok: false}
	log.Printf("手机注册:%s\n", user.Phone)
	u := User{
		Phone: user.Phone,
	}
	err := u.Find()
	if err == nil {
		m.Err = "手机号" + user.Phone + "已经使用，不能注册"
		r.JSON(200, m)
		return
	}
	user.IsManager = false
	err = user.New()
	if err != nil {
		m.Err = err.Error()
		r.JSON(200, m)
		return
	}
	l := Log{
		Uid:  user.Id,
		Work: "注册",
	}
	l.New()
	login(user.User, session, r)
}

// 用户登录
func UserLogin(session sessions.Session, user Captcha, r render.Render) {
	log.Printf("手机登陆:%s\n", user.Phone)
	u := User{
		Phone: user.Phone,
	}
	err := u.Find()
	if err != nil {
		r.JSON(200, Msg{
			Ok:  false,
			Cid: captcha.NewLen(4),
			Err: "手机号" + user.Phone + "未找到，没有注册",
		})
		return
	}
	if u.Password != user.Password {
		r.JSON(200, Msg{
			Ok:  false,
			Cid: captcha.NewLen(4),
			Err: "密码错误",
		})
		return
	}
	login(u, session, r)
}

// 用户登出
func UserLogout(session sessions.Session, r render.Render) {
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
	r.JSON(200, "ok")
}

// 登录
func login(user User, session sessions.Session, r render.Render) {
	s := Session{
		Uid: user.Id,
	}
	err := s.New()
	if err != nil {
		r.JSON(200, Msg{
			Ok:  false,
			Cid: captcha.NewLen(4),
			Err: err.Error(),
		})
		return
	}
	session.Set("id", s.Id.Hex())
	r.JSON(200, Msg{
		Ok:   true,
		Cid:  captcha.NewLen(4),
		Data: user,
	})
	log.Printf("用户 [ %s ] 登录成功\n", user.Name)
	l := Log{
		Uid:  user.Id,
		Work: "登录",
	}
	l.New()
}

// 获取用户信息
func UserGet(s Session, r render.Render) {
	r.JSON(200, Msg{
		Ok:   true,
		Data: s.User,
	})
}

// 修改密码
func UserPassword(p Password, s Session, r render.Render) {
	ok := p.Old == s.User.Password
	ret := Msg{
		Ok: ok,
	}
	if ok {
		s.User.Password = p.Password
		s.User.Save()
	} else {
		ret.Err = "旧密码错误"
	}
	r.JSON(200, ret)
}
