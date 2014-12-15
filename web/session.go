package web

import (
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 会话
type Session struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 当前用户
	Uid bson.ObjectId `bson:"uid,omitempty"`
	// 用户信息
	User User `bson:",omitempty"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty"`
}

// 登出
func (s *Session) Logout() error {
	return DB.C("session").RemoveId(s.Id)
}

// 会话查找
func (s *Session) Find() (err error) {
	c := DB.C("session")
	if s.Id.Valid() {
		err = c.FindId(s.Id).One(s)
		if err == nil {
			s.User.Id = s.Uid
			err = s.User.Find()
			return
		}
	}
	return errors.New("Id无效，无法查找")
}

// 创建会话
func (s *Session) Create() error {
	c := DB.C("session")
	s.Id = bson.NewObjectId()
	s.Ca = time.Now()
	return c.Insert(s)
}

// 身份认证
func Authorize(context martini.Context, session sessions.Session, rd render.Render) {
	if session.Get("id") != nil {
		s := Session{
			Id: bson.ObjectIdHex(session.Get("id").(string)),
		}
		err := s.Find()
		if err == nil {
			context.Map(s)
			return
		}
	}
	rd.Redirect("/")
}
