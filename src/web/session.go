package web

import (
	"encoding/json"
	"errors"
	log "github.com/Sirupsen/logrus"
	"github.com/go-martini/martini"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"net/http"
	"time"
)

type Session struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 当前用户
	Uid bson.ObjectId
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
	if !s.En {
		err = errors.New("用户已经退出")
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
		Uid: user.Id,
		Ca:  time.Now(),
		Ua:  time.Now(),
		En:  true,
	}
	err = c.Insert(&session)
	return
}

// 获取用户信息
func SessionHandle(params martini.Params) string {
	s, err := SessionFind(params["id"])
	ret := make(map[string]interface{})
	ret["ok"] = (err == nil)
	if err == nil {
		u, _ := UserFindById(s.Uid)
		ret["user"] = u
	} else {
		ret["err"] = err.Error()
	}
	res, _ := json.Marshal(ret)
	return string(res)
}

// 登录
func LoginHandle(w http.ResponseWriter, r *http.Request) (int, string) {
	log.Debug("login....")
	body, _ := ioutil.ReadAll(r.Body)
	var vs map[string]string
	ret := make(map[string]interface{})
	json.Unmarshal(body, &vs)
	s, u, err := Login(vs["phone"], vs["password"])
	if err != nil {
		ret["ok"] = false
		ret["err"] = err.Error()
		res, _ := json.Marshal(ret)
		return 200, string(res)
	}
	ret["id"] = s.Id.Hex()
	ret["user"] = u
	ret["ok"] = true
	res, _ := json.Marshal(ret)
	return 200, string(res)
}

// 登出
func LogoutHandle(params martini.Params) string {
	s, err := SessionFind(params["id"])
	if err == nil {
		s.Logout()
	}
	return "ok"
}
