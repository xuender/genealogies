package web

import (
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"time"
)

const logName = "log"

// 日志
type Log struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"-"`
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
	c := DB.C(logName)
	l.Id = bson.NewObjectId()
	l.Ca = time.Now()
	return c.Insert(l)
}

// 生成日志
func (l *Log) Log(oid bson.ObjectId, msg string) error {
	c := DB.C(logName)
	l.Work = msg
	l.Id = bson.NewObjectId()
	l.Ca = time.Now()
	l.Oid = oid
	return c.Insert(l)
}

// 读取用户
func (l *Log) Read() (err error) {
	if l.Uid.Valid() {
		l.User.Id = l.Uid
		err = l.User.Find()
	}
	return
}

// 查询
func (l *Log) Query(p Params) (logs []Log, count int, err error) {
	m := bson.M{}
	if l.Uid.Valid() {
		m["uid"] = l.Uid
	}
	if l.Oid.Valid() {
		m["oid"] = l.Oid
	}
	p.Find(m)
	q := DB.C(logName).Find(m)
	count, err = q.Count()
	if err == nil && count > 0 {
		err = q.Sort(p.Sort("-ca")).Skip(p.Skip()).Limit(p.Limit()).All(&logs)
	}
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
func LogQuery(session Session, params Params, r render.Render) {
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
func LogList(p martini.Params, params Params, r render.Render) {
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
