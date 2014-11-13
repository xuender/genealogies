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
	// 伴侣们
	P []bson.ObjectId `bson:"p,omitempty"`
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
func (i *Node) Partner() (node []Node, err error) {
	if len(i.P) > 0 {
		err = DB.C("node").Find(bson.M{"_id": bson.M{"$in": i.P}}).All(&node)
	}
	return
}

// 查找子女
func (i *Node) Children() (node []Node, err error) {
	err = DB.C("node").Find(bson.M{"f": i.Id}).All(&node)
	return
}

// 设置父亲、伴侣、孩子 T
func (i *Node) Add(t string, d Data) Node {
	id := bson.NewObjectId()
	if t == "f" {
		if i.F.Valid() {
			r, _ := NodeFind(i.F)
			return r
		}
		i.F = id
	}
	if t == "p" {
		i.P = append(i.P, id)
	}
	i.Save(i.Cb)
	node := NodeNew(d)
	node.Id = id
	if t == "c" {
		node.F = i.Id
	}
	node.Save(i.Cb)
	return node
}

// 删除节点
func (i *Node) Del() error {
	if len(i.P) > 0 {
		return errors.New("删除前请先删除伴侣")
	}
	cs, err := i.Children()
	if err != nil {
		return err
	}
	if !i.F.Valid() && len(cs) < 2 {
		if len(cs) == 1 {
			nn := Node{}
			cs[0].F = nn.Id
			cs[0].Save(cs[0].Cb)
		}
	} else if len(cs) > 0 {
		return errors.New("删除前请先删除子女")
	}
	return DB.C("node").RemoveId(i.Id)
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
		data := Data{}
		body, err := ioutil.ReadAll(r.Body)
		if err == nil {
			json.Unmarshal(body, &data)
			log.Debug(data)
			c := node.Add(params["type"], data)
			c.Save(node.Cb)
			ret["node"] = c
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

// 删除节点
func NodeDelHandle(params martini.Params, r *http.Request) (int, string) {
	node, err := NodeFind(bson.ObjectIdHex(params["id"]))
	ret := make(map[string]interface{})
	ok := false
	if err == nil {
		err = node.Del()
		ok = err == nil
	} else {
		log.Error(err)
	}
	if !ok {
		ret["error"] = err.Error()
	}
	ret["ok"] = ok
	res, _ := json.Marshal(ret)
	return 200, string(res)
}
