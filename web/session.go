package web

import (
	"../base"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"time"
)

// 会话
type Session struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"id" table:"session"`
	// IP
	Ip string `bson:"ip,omitempty" json:"ip"`
	// 当前用户
	Uid bson.ObjectId `bson:"uid,omitempty" json:"uid"`
	// 姓名
	Name string `bson:"name" json:"name"`
	// 手机
	Phone string `bson:"phone,omitempty" json:"phone"`
	// 是否是管理员
	Cs bool `bson:"cs" json:"cs"`
	// 用户信息
	User User `bson:",omitempty" json:"user"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty" json:"ua"`
}

// 登出
func (s *Session) Logout() error {
	return base.Remove(s)
}

// 会话查找
func (s *Session) Find() (err error) {
	err = base.Find(s)
	if err == nil {
		s.Read()
	}
	return
}

// 读取用户
func (s *Session) Read() (err error) {
	if s.Uid.Valid() {
		s.User.Id = s.Uid
		err = s.User.Find()
	}
	return
}

// 创建会话
func (s *Session) New() error {
	return s.Save()
}

// 保存
func (s *Session) Save() error {
	return base.Save(s)
}

// 查询
func (s *Session) Query(p base.Params) (session []Session, count int, err error) {
	count, err = p.Query(s, "-ca", &session)
	return
}

// 身份认证
func Authorize(context martini.Context, session sessions.Session,
	r render.Render, req *http.Request) {
	if session.Get("id") != nil {
		s := Session{
			Id: bson.ObjectIdHex(session.Get("id").(string)),
		}
		err := s.Find()
		if err == nil {
			s.Ip = req.RemoteAddr
			context.Map(s)
			s.Save()
			return
		}
	}
	r.Redirect("/")
}

// json身份认证
func AuthJson(context martini.Context, session sessions.Session,
	r render.Render, req *http.Request) {
	if session.Get("id") != nil {
		s := Session{
			Id: bson.ObjectIdHex(session.Get("id").(string)),
		}
		err := s.Find()
		if err == nil {
			s.Ip = req.RemoteAddr
			context.Map(s)
			s.Save()
			l := Log{
				Uid: s.Uid,
				Ip:  s.Ip,
			}
			context.Map(l)
			return
		}
	}
	r.JSON(200, Msg{Ok: false, Err: "身份认证错误"})
}

// 管理员json身份认证
func ManagerJson(context martini.Context, session sessions.Session,
	r render.Render, req *http.Request) {
	if session.Get("id") != nil {
		s := Session{
			Id: bson.ObjectIdHex(session.Get("id").(string)),
		}
		err := s.Find()
		if err == nil && s.User.Cs {
			s.Ip = req.RemoteAddr
			context.Map(s)
			s.Save()
			l := Log{
				Uid: s.Uid,
				Ip:  s.Ip,
			}
			context.Map(l)
			return
		}
	}
	r.JSON(200, Msg{Ok: false, Err: "管理员身份认证错误"})
}

// 查询会话
func SessionQuery(params base.Params, r render.Render) {
	ret := Msg{}
	s := Session{}
	ls, count, err := s.Query(params)
	ret.Ok = err == nil
	if err == nil {
		ret.Count = count
		for i, _ := range ls {
			ls[i].Read()
		}
		ret.Data = ls
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// 删除会话
func SessionRemove(params martini.Params, r render.Render) {
	s := Session{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := s.Logout()
	ok := err == nil
	m := Msg{
		Ok: ok,
	}
	if !ok {
		m.Err = err.Error()
	}
	r.JSON(200, m)
}
