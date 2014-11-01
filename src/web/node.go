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

// 节点
type Node struct {
	// 基本信息
	Base
	Data
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 父亲
	F bson.ObjectId `bson:"f,omitempty"`
	// 母亲
	M bson.ObjectId `bson:"m,omitempty"`
	// 伴侣
	P bson.ObjectId `bson:"p,omitempty"`
	//// 其他父亲
	//Fs []bson.ObjectId `bson:"fs,omitempty"`
	//// 其他母亲
	//Ms []bson.ObjectId `bson:"ms,omitempty"`
	//// 其他伴侣
	//ps []bson.ObjectId `bson:"ps,omitempty"`
}

// 新建节点
func NodeNew(data Data) Node {
	return Node{
		Base: Base{En: true},
		Data: data,
		Id:   bson.NewObjectId(),
	}
}

// 查找节点
func NodeFind(id bson.ObjectId) (Node, error) {
	n := Node{}
	err := DB.C("node").FindId(id).One(&n)
	log.WithFields(log.Fields{
		"id":   id,
		"node": n,
		"err":  err,
	}).Debug("NodeFind")
	if !n.En {
		return n, errors.New("节点已经删除")
	}
	return n, err
}

// 保存
func (n *Node) Save(uid bson.ObjectId) error {
	c := DB.C("node")
	if n.Ca.IsZero() {
		n.Ca = time.Now()
		n.Cb = uid
		return c.Insert(n)
	}
	n.Ua = time.Now()
	n.Ub = uid
	return c.UpdateId(n.Id, n)
}

// 设置父亲
func (i *Node) SetF(n string) Node {
	return Node{}
}

// 设置母亲
func (i *Node) SetM(n string) Node {
	return Node{}
}

// 设置伴侣
func (i *Node) SetP(n string) Node {
	return Node{}
}

// 增加子女
func (i *Node) AddC(n string) Node {
	return Node{}
}

// 修改节点信息
func NodeUpdateHandle(params martini.Params, r *http.Request) (int, string) {
	node, err := NodeFind(bson.ObjectIdHex(params["id"]))
	ret := make(map[string]interface{})
	ret["ok"] = false
	if err == nil {
		data := Data{}
		body, err := ioutil.ReadAll(r.Body)
		if err == nil {
			json.Unmarshal(body, &data)
			log.Debug(data)
			node.Data = data
			node.Save(node.Cb)
			ret["ok"] = true
		} else {
			log.Error(err)
		}
	} else {
		log.Error(err)
	}
	res, _ := json.Marshal(ret)
	return 200, string(res)
}
