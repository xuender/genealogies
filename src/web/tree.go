package web

import (
	"gopkg.in/mgo.v2/bson"
)

// 树状信息
type Tree struct {
	Data
	// 节点ID
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 伴侣
	P []interface{}
	// 子女
	C []interface{}
}

// 新建节点
func TreeNew(n Node) Tree {
	return Tree{
		Data: n.Data,
		Id:   n.Id,
	}
}

// 创建家族树
func (t *Tree) Create(n Node, i rune) {
	if i < 1 {
		return
	}
	ps, err := n.Partner()
	if err == nil {
		for _, p := range ps {
			nt := TreeNew(p)
			nt.Create(p, i-1)
			t.P = append(t.P, nt)
		}
	}
	cs, err := n.Children()
	if err == nil {
		for _, c := range cs {
			nt := TreeNew(c)
			nt.Create(c, i-1)
			t.C = append(t.C, nt)
		}
	}
}
