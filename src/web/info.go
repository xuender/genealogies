package web

import (
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/go-martini/martini"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 人员基本信息
type Data struct {
	// 姓名
	N string
	// 性别 true男 false女
	G bool
	// 生日
	B time.Time
	// 在世
	L bool
	// 忌日
	D time.Time
	// 电话
	T string
}

// 用户信息
type Info struct {
	// 基本信息
	Base
	//Data
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 树状信息
	T Tree
}

// 新建节点
func InfoNew(data Data, nodeId bson.ObjectId) Info {
	return Info{
		Base: Base{En: true},
		T: Tree{
			Data: data,
			Id:   nodeId,
		},
		Id: bson.NewObjectId(),
	}
}

// 保存
func (n *Info) Save(uid bson.ObjectId) error {
	c := DB.C("info")
	if n.Ca.IsZero() {
		n.Ca = time.Now()
		n.Cb = uid
		return c.Insert(n)
	}
	n.Ua = time.Now()
	n.Ub = uid
	return c.UpdateId(n.Id, n)
}

// 转换JSON格式
func (i *Info) Json() string {
	res, _ := json.Marshal(i)
	return string(res)
}

// 重新读取用户信息
func (i *Info) Rest() {
	n, err := NodeFind(i.T.Id)
	if err == nil {
		//i.S = "本人"
		root := n.Root(4)
		tree := TreeNew(*root)
		tree.Create(*root, 9)
		i.T = tree
		i.Save(i.Cb)
	}
}

// 获取用户信息
func InfoHandle(params martini.Params) string {
	u, err := UserFindById(bson.ObjectIdHex(params["id"]))
	log.WithFields(log.Fields{
		"id":  params["id"],
		"u":   u,
		"err": err,
	}).Debug("InfoHandle")
	if err == nil {
		return u.ToInfo()
	}
	return "{}"
}
