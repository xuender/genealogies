package clan

import (
	//  "errors"
	"gopkg.in/mgo.v2/bson"
	"log"
)

// 树结构
type Tree struct {
	Data
	// 节点ID
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 伴侣
	P []*Tree `bson:"p"`
	// 子女
	C []*Tree `bson:"c"`
	// 节点
	Node *Node `bson:"-" json:"-"`
}

// 新建 必须条件是手机号 T
func (t *Tree) New() error {
	n := Node{
		Id: t.Id,
	}
	err := n.Find()
	if err == nil {
		root := n.Root(4) //查找4祖
		t.Data = root.Data
		t.Id = root.Id
		t.Node = root
		t.Read(9, t.Id) // 读取9族
	} else {
		n.Data = t.Data
		n.Save()
		t.Id = n.Id
		t.E = "自身"
		t.Node = &n
	}
	return nil
}

// 读取妻子、儿女 T
func (t *Tree) Read(r rune, nid bson.ObjectId) {
	log.Println(r)
	if r < 1 {
		return
	}
	if t.Node == nil {
		n := Node{
			Id: t.Id,
		}
		n.Find()
		t.Node = &n
		t.Data = n.Data
	}
	if t.Id == nid {
		t.E = "自身"
	}
	// 查找伴侣
	ps, err := t.Node.Partner()
	if err == nil {
		for _, p := range ps {
			nt := Tree{
				Id:   p.Id,
				Node: &p,
			}
			nt.Data = p.Data
			t.P = append(t.P, &nt)
		}
	}
	// 查找子女
	cs, err2 := t.Node.Children()
	if err2 == nil {
		for _, c := range cs {
			nt := Tree{
				Id:   c.Id,
				Node: &c,
			}
			nt.Data = c.Data
			t.C = append(t.C, &nt)
			nt.Read(r-1, nid)
		}
	}
}
