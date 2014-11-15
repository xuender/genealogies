package web

import (
	"encoding/json"
	"errors"
	log "github.com/Sirupsen/logrus"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"gopkg.in/mgo.v2/bson"
	//"net/http"
	"time"
)

type Session struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 当前用户
	Uid bson.ObjectId `bson:"uid,omitempty"`
	// 校验字段
	Key bson.ObjectId `bson:"key,omitempty"`
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
func SessionFind(session sessions.Session) (Session, error) {
	s := Session{}
	if session.Get("id") == nil || session.Get("key") == nil {
		return s, errors.New("用户认证失败.")
	}
	c := DB.C("session")
	id := session.Get("id").(string)
	err := c.FindId(bson.ObjectIdHex(id)).One(&s)
	log.WithFields(log.Fields{
		"id":      id,
		"session": s,
		"err":     err,
	}).Debug("SessionHandle")
	if err == nil {
		if !s.En {
			err = errors.New("用户已经退出")
		}
		if s.Key.Hex() != session.Get("key").(string) {
			err = errors.New("用户认证失败")
		}
	}
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
		Key: bson.NewObjectId(),
		Uid: user.Id,
		Ca:  time.Now(),
		Ua:  time.Now(),
		En:  true,
	}
	err = c.Insert(&session)
	return
}

// 身份认证
func Authorize(context martini.Context, session sessions.Session, rd render.Render) {
	if session.Get("id") != nil {
		s, err := SessionFind(session)
		if err == nil {
			context.Map(s)
			return
		}
	}
	rd.Redirect("/")
}

// 获取用户信息
func SessionHandle(session sessions.Session) string {
	s, err := SessionFind(session)
	ret := make(map[string]interface{})
	ret["ok"] = (err == nil)
	if err == nil {
		u, _ := UserFindById(s.Uid)
		ret["user"] = u
		ret["id"] = s.Id.Hex()
	} else {
		ret["err"] = err.Error()
	}
	res, _ := json.Marshal(ret)
	return string(res)
}

type LoginForm struct {
	Phone    string `form:"phone" binding:"required"`
	Password string `form:"password" binding:"required"`
}

// 登录
func LoginHandle(session sessions.Session, lf LoginForm) string {
	log.Debug("login....")
	ret := make(map[string]interface{})
	s, u, err := Login(lf.Phone, lf.Password)
	if err != nil {
		ret["ok"] = false
		ret["err"] = err.Error()
		res, _ := json.Marshal(ret)
		return string(res)
	}
	session.Set("id", s.Id.Hex())
	session.Set("key", s.Key.Hex())
	//ret["id"] = s.Id.Hex()
	ret["user"] = u
	ret["ok"] = true
	res, _ := json.Marshal(ret)
	return string(res)
}

// 登出
func LogoutHandle(session sessions.Session) string {
	s, err := SessionFind(session)
	if err == nil {
		s.Logout()
		session.Delete("id")
		session.Delete("key")
	}
	return "ok"
}
