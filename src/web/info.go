package web

import (
	"encoding/json"
	"github.com/go-martini/martini"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 用户信息
type Info struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 姓名
	N string
	// 节点ID
	O bson.ObjectId
	// 性别 true男 false女
	G bool
	// 生日
	B time.Time
	// 在世
	L bool
	// 忌日
	D time.Time
	// 称呼 默认是我
	S string
	// 电话
	T string
	// 父亲
	F interface{}
	// 母亲
	M interface{}
	// 伴侣
	P interface{}
	// 其他父亲
	Fs []interface{}
	// 其他母亲
	Ms []interface{}
	// 其他伴侣
	ps []interface{}
}

// 转换JSON格式
func (i *Info) Json() string {
	res, _ := json.Marshal(i)
	return string(res)
}

// 重新读取用户信息
func (i *Info) Rest() {
	//TODO 递归读取node重新生成info
}

// 获取用户信息
func InfoHandle(params martini.Params) string {
	s, err := SessionFind(params["id"])
	if err == nil {
		return s.Info()
	}
	return "{}"
}
