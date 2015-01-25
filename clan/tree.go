package clan

import (
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

const (
	ME = "本人"
)

// 树结构
type Tree struct {
	Data
	// 节点ID
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 父亲
	F *Tree `bson:"-" json:"-"`
	// 伴侣
	P []*Tree `bson:"p"`
	// 子女
	C []*Tree `bson:"c"`
	// 节点
	Node *Node `bson:"-" json:"-"`
}

// 查找根节点
func (t *Tree) Root() *Tree {
	if t.F == nil {
		return t
	}
	return t.F.Root()
}

// 查找
func (t *Tree) Find(title string) *Tree {
	if t.E == title {
		return t
	}
	for _, c := range t.C {
		if c.E == title {
			return c
		}
		r := c.Find(title)
		if r != nil {
			return r
		}
	}
	return nil
}
func (t *Tree) SetE() {
}

// 设置标题
func (t *Tree) Title() {
	log.Println("重新设置title:", t.N)
	if t.E == "" {
		for _, c := range t.C {
			c.Title()
			if c.E != "" {
				ti, ok := titles[c.E]
				if ok {
					t.E = ti.F
					if t.F != nil && t.F.E == "" {
						t.F.Title()
						break
					}
				}
			}
		}
	}
	if t.E != "" {
		ti, ok := titles[t.E]
		if ok {
			for _, p := range t.P {
				if p.E == "" {
					if p.G {
						p.E = ti.Pt
					} else {
						p.E = ti.Pf
					}
				}
			}
			b := time.Now()
			if ti.B != "" {
				log.Println(t.Root())
				c := t.Root().Find(ti.B)
				if c != nil {
					log.Println(b)
					log.Println(c.B)
					b = c.B
				}
			}
			for _, c := range t.C {
				if c.E == "" {
					if c.G {
						if ti.B != "" {
							if b.Unix() > c.B.Unix() {
								c.E = ti.Cta
							} else {
								c.E = ti.Ctb
							}
						} else {
							c.E = ti.Ct
						}
					} else {
						if ti.B != "" {
							if b.Unix() > c.B.Unix() {
								c.E = ti.Cfa
							} else {
								c.E = ti.Cfb
							}
						} else {
							c.E = ti.Cf
						}
					}
					c.Title()
				}
			}
		}
	}
}

// 新建 必须条件是手机号 T
func (t *Tree) New() error {
	n := Node{
		Id: t.Id,
	}
	n.Data = t.Data
	err := n.Find()
	if err == nil {
		root := n.Root(4) //查找4祖
		t.Data = root.Data
		t.Id = root.Id
		t.Node = root
		t.Read(9, n.Id) // 读取9族
	} else {
		n.Data = t.Data
		n.Save()
		t.Id = n.Id
		t.Node = &n
	}
	return nil
}

// 读取妻子、儿女 T
func (t *Tree) Read(r rune, nid bson.ObjectId) {
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
		t.E = ""
	}
	if t.Id == nid {
		t.E = ME
	} else {
		t.E = ""
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
			pcs, e1 := p.Children()
			if e1 == nil {
				for _, pc := range pcs {
					nc := Tree{
						Id:   pc.Id,
						Node: &pc,
					}
					nc.Data = pc.Data
					nt.C = append(nt.C, &nc)
				}
			}
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
				F:    t,
			}
			nt.Data = c.Data
			t.C = append(t.C, &nt)
			nt.Read(r-1, nid)
		}
	}
}
