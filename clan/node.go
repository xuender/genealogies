package clan

import (
	"../base"
	"../web"
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

type Id struct {
	// 主键
	Id string
}

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
	// 使用标记
	U bool `bson:"u,omitempty"`
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
		err := base.Find(n)
		if err == nil {
			return nil
		}
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
		// 设置称谓
		if o.E != "" {
			ti, ok := titles[o.E]
			if ok {
				if o.G {
					o.E = ti.Pt
				} else {
					o.E = ti.Pf
				}
			} else {
				o.E = ""
			}
		}
	}
	if t == "p" {
		o.P = append(o.P, n.Id)
		o.Save()
		n.P = append(n.P, o.Id)
		// 设置称谓
		if o.E != "" {
			ti, ok := titles[o.E]
			if ok {
				if o.G {
					o.E = ti.Pt
				} else {
					o.E = ti.Pf
				}
			} else {
				o.E = ""
			}
		}
	}
	if t == "c" {
		o.F = n.Id
		o.Save()
		n.C = append(n.C, o.Id)
		// 设置称谓
		if o.E != "" {
			ti, ok := titles[o.E]
			if ok {
				if o.G {
					o.E = ti.Ct
				} else {
					o.E = ti.Cf
				}
			} else {
				o.E = ""
			}
		}
	}
	n.Save()
	return o
}

// 删除节点
func (n *Node) Remove() error {
	log.Println(n)
	if n.U {
		return errors.New("用户使用不能删除")
	}
	if n.F.Valid() && len(n.P) > 0 {
		return errors.New("删除前请先删除伴侣")
	}
	cs, err := n.Children()
	if err != nil {
		return err
	}
	if !n.F.Valid() && len(cs) < 2 {
		if len(cs) == 1 {
			cs[0].F = *new(bson.ObjectId)
			cs[0].Save()
		}
	} else if len(cs) > 0 {
		return errors.New("删除前请先删除子女")
	}
	for _, pid := range n.P {
		p := Node{
			Id: pid,
		}
		p.Find()
		base.SliceRemove(&p.P, n.Id)
		p.Save()
	}
	return base.Remove(n)
}

// 查找伴侣 T
func (n *Node) Partner() (nodes []Node, err error) {
	if len(n.P) > 0 {
		err = base.Query(n, &nodes, bson.M{"_id": bson.M{"$in": n.P}}, "data.b")
	}
	return
}

// 查找子女 T
func (n *Node) Children() (nodes []Node, err error) {
	if len(n.C) > 0 {
		err = base.Query(n, &nodes, bson.M{"_id": bson.M{"$in": n.C}}, "-data.g", "data.b")
	}
	return
}

// 设置子女
func (i *Node) Child(ids []string) error {
	i.C = []bson.ObjectId{}
	for _, id := range ids {
		node := Node{
			Id: bson.ObjectIdHex(id),
		}
		err := node.Find()
		if err != nil {
			return err
		}
		i.C = append(i.C, node.Id)
	}
	i.Save()
	log.Println(i)
	return nil
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

// 节点删除
func NodeRemove(session web.Session, params martini.Params, r render.Render) {
	ret := web.Msg{}
	n := Node{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := n.Find()
	if err == nil {
		err = n.Remove()
		if err == nil {
			InfoRemove(session)
		}
	}
	ret.Ok = err == nil
	if err != nil {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// 设置孩子
func NodeChild(session web.Session, ids []Id, params martini.Params, r render.Render) {
	log.Println(ids)
	ret := web.Msg{}
	node := Node{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := node.Find()
	ret.Ok = err == nil
	if ret.Ok {
		var is []string
		for _, i := range ids {
			is = append(is, i.Id)
		}
		node.Child(is)
		cs, _ := node.Children()
		ret.Data = cs
		InfoRemove(session)
	}
	if err != nil {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}
