package web

import (
	"encoding/json"
	"errors"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 日志
type Log struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"-"`
	// 姓名
	Work string `bson:"work,omitempty"`
	// 用户ID
	Uid bson.ObjectId `bson:"uid,omitempty" json:"-"`
	// 用户
	User User `bson:",omitempty" json:"-"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty"`
}

// 创建日志
func (l *Log) Create() error {
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
func (l *Log) Query(skip, limit int) (logs []Log, count int, err error) {
	if !l.Uid.Valid() {
		err = errors.New("用户不能为空")
		return
	}
	q := DB.C("log").Find(bson.M{"uid": l.Uid})
	count, err = q.Count()
	if err == nil && count > 0 {
		err = q.Sort("-ca").Skip(skip).Limit(limit).All(&logs)
	}
	return
}

// 查询日志
func LogQuery(session Session) string {
	ret := make(map[string]interface{})
	l := Log{
		Uid: session.Uid,
	}
	ls, count, err := l.Query(0, 100)
	ret["ok"] = err == nil
	if err == nil {
		ret["count"] = count
		ret["data"] = ls
	} else {
		ret["err"] = err.Error()
	}
	res, _ := json.Marshal(ret)
	return string(res)
}
