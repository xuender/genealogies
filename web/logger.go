package web

import (
	"../base"
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"time"
)

// 日志
type Log struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"-" table:"log"`
	// 对象ID
	Oid bson.ObjectId `bson:"oid,omitempty" json:"-"`
	// 姓名
	Work string `bson:"work,omitempty" json:"work"`
	// IP
	Ip string `bson:"ip,omitempty" json:"ip"`
	// 用户ID
	Uid bson.ObjectId `bson:"uid,omitempty" json:"-"`
	// 用户
	User User `bson:",omitempty" json:"user"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
}

// 创建日志
func (l *Log) New() error {
	if l.Id.Valid() {
		return errors.New("日志ID错误")
	}
	if l.Work == "" {
		return errors.New("日志不能为空")
	}
	if !l.Uid.Valid() {
		return errors.New("用户不能为空")
	}
	return l.Save()
}

// 生成日志
func (l *Log) Log(oid bson.ObjectId, msg string) error {
	log := l
	log.Work = msg
	log.Oid = oid
	return log.Save()
}

// 读取用户
func (l *Log) Read() (err error) {
	if l.Uid.Valid() {
		l.User.Id = l.Uid
		err = l.User.Find()
	}
	return
}

// 保存
func (l *Log) Save() error {
	return base.Save(l)
}

// 查询
func (l *Log) Query(p base.Params) (logs []Log, count int, err error) {
	m := make(map[string]interface{})
	if l.Uid.Valid() {
		m["uid"] = l.Uid
	}
	if l.Oid.Valid() {
		m["oid"] = l.Oid
	}
	if len(m) == 0 {
		err = errors.New("缺少日志过滤条件")
		return
	}
	count, err = p.QueryM(l, "-ca", &logs, m)
	return
}

// 创建日志
func LogNew(work string) martini.Handler {
	return func(s Session, req *http.Request) {
		l := Log{
			Uid:  s.Uid,
			Work: work,
			Ip:   req.RemoteAddr,
		}
		l.New()
	}
}

// 查询日志
func LogQuery(session Session, params base.Params, r render.Render) {
	ret := Msg{}
	l := Log{
		Uid: session.Uid,
	}
	ls, count, err := l.Query(params)
	ret.Ok = err == nil
	if err == nil {
		ret.Count = count
		ret.Data = ls
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// 日志列表
func LogList(p martini.Params, params base.Params, r render.Render) {
	ret := Msg{}
	l := Log{
		Oid: bson.ObjectIdHex(p["oid"]),
	}
	ls, count, err := l.Query(params)
	ret.Ok = err == nil
	if err == nil {
		for i, _ := range ls {
			ls[i].Read()
		}
		ret.Count = count
		ret.Data = ls
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}
