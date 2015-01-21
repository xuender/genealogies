package clan

import (
	"../base"
	"../web"
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 加点
type Node struct {
	Data
	Id bson.ObjectId `bson:"_id,omitempty" table:"node"`
	// 父亲
	F bson.ObjectId `bson:"f,omitempty"`
	// 母亲
	M bson.ObjectId `bson:"m,omitempty"`
	// 伴侣们
	P []bson.ObjectId `bson:"p,omitempty"`
	// 子女们
	C []bson.ObjectId `bson:"c,omitempty"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty"`
}

// 保存 T
func (n *Node) Save() error {
	return base.Save(n)
}

// 查找 T
func (n *Node) Find() error {
	if n.Id.Valid() {
		return base.Find(n)
	}
	// 按照手机查找
	if n.T != "" {
		m := bson.M{
			"data.t": n.T,
		}
		return base.FindM(n, m)
	}
	return errors.New("缺少查询条件")
}

// 查找根节点 T
func (n *Node) Root(r rune) *Node {
	if r < 1 {
		return n
	}
	if n.F.Valid() {
		f := Node{
			Id: n.F,
		}
		if f.Find() == nil {
			return f.Root(r - 1)
		}
	}
	return n
}

// 设置父亲、伴侣、孩子 T
func (n *Node) Add(t string, d Data) Node {
	o := Node{}
	o.Data = d
	if t == "f" {
		if n.F.Valid() {
			o.Id = n.F
			o.Find()
			return o
		}
		o.C = append(o.C, n.Id)
		o.Save()
		n.F = o.Id
	}
	if t == "p" {
		o.P = append(o.P, n.Id)
		o.Save()
		n.P = append(n.P, o.Id)
	}
	if t == "c" {
		o.F = n.Id
		o.Save()
		n.C = append(n.C, o.Id)
	}
	n.Save()
	return o
}

// 查找伴侣 T
func (n *Node) Partner() (nodes []Node, err error) {
	if len(n.P) > 0 {
		err = base.Query(n, bson.M{"_id": bson.M{"$in": n.P}}, &nodes)
	}
	return
}

// 查找子女 T
func (n *Node) Children() (nodes []Node, err error) {
	if len(n.C) > 0 {
		err = base.Query(n, bson.M{"_id": bson.M{"$in": n.C}}, &nodes)
	}
	return
}

// 修改节点信息
func NodeUpdate(session web.Session, data Data, params martini.Params, r render.Render) {
	ret := web.Msg{}
	n := Node{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := n.Find()
	ret.Ok = err == nil
	if ret.Ok {
		n.Data = data
		err = n.Save()
	}
	ret.Ok = err == nil
	if ret.Ok {
		InfoRemove(session)
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// 增加节点信息
func NodeAdd(session web.Session, data Data, params martini.Params, r render.Render) {
	ret := web.Msg{}
	n := Node{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := n.Find()
	ret.Ok = err == nil
	if ret.Ok {
		c := n.Add(params["type"], data)
		ret.Data = c
		InfoRemove(session)
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}
