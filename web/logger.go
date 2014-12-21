package web

import (
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 日志
type Log struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"-"`
	// 姓名
	Work string `bson:"work,omitempty" json:"work"`
	// 用户ID
	Uid bson.ObjectId `bson:"uid,omitempty" json:"-"`
	// 用户
	User User `bson:",omitempty" json:"-"`
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
	c := DB.C("log")
	l.Id = bson.NewObjectId()
	l.Ca = time.Now()
	return c.Insert(l)
}

// 查询
func (l *Log) Query(p Params) (logs []Log, count int, err error) {
	if !l.Uid.Valid() {
		err = errors.New("用户不能为空")
		return
	}
	m := bson.M{"uid": l.Uid}
	p.Find(m)
	q := DB.C("log").Find(m)
	count, err = q.Count()
	if err == nil && count > 0 {
		err = q.Sort(p.Sort("-ca")).Skip(p.Skip()).Limit(p.Limit()).All(&logs)
	}
	return
}

// 创建日志
func LogNew(work string) martini.Handler {
	return func(s Session) {
		l := Log{
			Uid:  s.Uid,
			Work: work,
		}
		l.New()
	}
}

// 查询日志
func LogQuery(session Session, params Params, r render.Render) {
	ret := make(map[string]interface{})
	l := Log{
		Uid: session.Uid,
	}
	ls, count, err := l.Query(params)
	ret["ok"] = err == nil
	if err == nil {
		ret["count"] = count
		ret["data"] = ls
	} else {
		ret["err"] = err.Error()
	}
	r.JSON(200, ret)
}
