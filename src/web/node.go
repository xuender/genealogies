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

// 新建节点 T
func NodeNew(data Data) Node {
	return Node{
		Base: Base{En: true},
		Data: data,
		Id:   bson.NewObjectId(),
	}
}

// 查找节点 T
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

// 保存 T
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

// 查找根节点 T
func (i *Node) Root(n rune) *Node {
	//log.WithFields(log.Fields{
	//  "id":  i.Id,
	//  "n":   n,
	//}).Info("Root")
	if n < 1 {
		return i
	}
	if i.F.Valid() {
		f, err := NodeFind(i.F)
		if err == nil {
			return f.Root(n - 1)
		}
	}
	return i
}

// 查找伴侣 T
func (i *Node) Partner() (*Node, error) {
	n := Node{}
	if i.P.Valid() {
		err := DB.C("node").FindId(i.P).One(&n)
		return &n, err
	}
	return &n, errors.New("未找到")
}

// 查找子女
func (i *Node) Children() (node []Node, err error) {
	err = DB.C("node").Find(bson.M{"f": i.Id}).All(&node)
	return
}

// 设置父亲、伴侣、母亲 T
func (i *Node) Add(t string) Node {
	g := false
	n := "姓名"
	id := bson.NewObjectId()
	l := false
	if t == "f" {
		if i.F.Valid() {
			r, _ := NodeFind(i.F)
			return r
		}
		g = true
		n = i.N + "的父亲"
		i.F = id
	}
	if t == "p" {
		if i.P.Valid() {
			r, _ := NodeFind(i.P)
			return r
		}
		g = !i.G
		l = true
		if g {
			n = i.N + "的丈夫"
		} else {
			n = i.N + "的妻子"
		}
		i.P = id
	}
	c := false
	if t == "c" {
		g = true
		n = i.N + "的儿子"
		c = true
		l = true
	}
	bt, _ := time.Parse("2006-01-02", "2000-01-01")
	d := Data{
		G: g,
		N: n,
		L: l,
		B: bt,
	}
	i.Save(i.Cb)
	node := NodeNew(d)
	node.Id = id
	if c {
		node.F = i.Id
	}
	node.Save(i.Cb)
	return node
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

// 增加节点信息
func NodeAddHandle(params martini.Params, r *http.Request) (int, string) {
	node, err := NodeFind(bson.ObjectIdHex(params["id"]))
	ret := make(map[string]interface{})
	ret["ok"] = false
	if err == nil {
		ret["ok"] = true
		ret["node"] = node.Add(params["type"])
	} else {
		log.Error(err)
	}
	res, _ := json.Marshal(ret)
	return 200, string(res)
}
