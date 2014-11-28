package web

import (
	log "github.com/Sirupsen/logrus"
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
func (t *Tree) Create(n Node, nodeId bson.ObjectId, i rune) {
	if i < 1 {
		return
	}
	if n.Id == nodeId {
		n.E = "自身"
	}
	ps, err := n.Partner()
	if err == nil {
		for _, p := range ps {
			nt := TreeNew(p)
			// TODO 伴侣不递归子女 nt.Create(p, i-1)
			t.P = append(t.P, nt)
		}
	}
	cs, err := n.Children()
	if err == nil {
		for _, c := range cs {
			if c.Id == nodeId {
				c.E = "自身"
			}
			log.WithFields(log.Fields{
				"c.id":   c.Id.Hex(),
				"c.N":    c.N,
				"nodeId": nodeId,
			}).Debug("Create")
			nt := TreeNew(c)
			nt.Create(c, nodeId, i-1)
			t.C = append(t.C, nt)
		}
	}
}
