package web

import (
	"errors"
	"github.com/dchest/captcha"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"time"
)

// 修改密码
type Password struct {
	Password string `form:"password" binding:"required"`
	Old      string `form:"old" binding:"required"`
}

// 用户
type User struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"id"`
	// 手机
	Phone string `bson:"phone" json:"phone"`
	// 姓名
	Name string `bson:"name" json:"name"`
	// 密码
	Password string `bson:"password" json:"-"`
	// 是否是客服
	Cs bool `bson:"cs" json:"cs"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty" json:"ua"`
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
	u.Cs = false
	err = c.Insert(u)
	return
}

// 查询
func (u *User) Query(p Params) (users []User, count int, err error) {
	m := bson.M{}
	p.Find(m)
	q := DB.C("user").Find(m)
	count, err = q.Count()
	if err == nil && count > 0 {
		err = q.Sort(p.Sort("-ca")).Skip(p.Skip()).Limit(p.Limit()).All(&users)
	}
	return
}

// 用户注册
func UserRegister(session sessions.Session, user Captcha,
	r render.Render, req *http.Request) {
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
	user.Cs = false
	err = user.New()
	if err != nil {
		m.Err = err.Error()
		r.JSON(200, m)
		return
	}
	l := Log{
		Uid:  user.Id,
		Work: "注册",
		Ip:   req.RemoteAddr,
	}
	l.New()
	login(user.User, session, r, req.RemoteAddr)
}

// 用户登录
func UserLogin(session sessions.Session, user Captcha,
	r render.Render, req *http.Request) {
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
	login(u, session, r, req.RemoteAddr)
}

// 用户登出
func UserLogout(s Session, session sessions.Session, r render.Render) {
	s.Logout()
	session.Delete("id")
	r.Redirect("/")
}

// 登录
func login(user User, session sessions.Session, r render.Render,
	ip string) {
	s := Session{
		Uid:   user.Id,
		Name:  user.Name,
		Phone: user.Phone,
		Cs:    user.Cs,
		Ip:    ip,
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
		Ip:   ip,
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

// 查询用户
func UserQuery(params Params, r render.Render) {
	ret := Msg{}
	u := User{}
	ls, count, err := u.Query(params)
	log.Printf("count:%d\n", count)
	ret.Ok = err == nil
	if err == nil {
		ret.Count = count
		ret.Data = ls
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}
