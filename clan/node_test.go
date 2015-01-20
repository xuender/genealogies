package clan

import (
	"../base"
	"testing"
)

func TestNodeFind(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	d := Data{
		T: "110",
		N: "xcy",
	}
	o := Node{
		Data: d,
	}
	err := o.Save()
	if err != nil {
		t.Errorf("node保存错误:%s", err)
	}
	n := Node{}
	n.T = "110"
	err = n.Find()
	if err != nil {
		t.Errorf("node查找错误:%s", err)
	}
	if n.N != o.N {
		t.Errorf("node查找错误:%s", n)
	}
}
func TestNodePartner(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	n := Node{}
	n.N = "test"
	n.Save()
	p := n.Add("p", Data{N: "test的丈夫"})
	fp, err := n.Partner()
	if err != nil || p.Id != fp[0].Id {
		t.Errorf("伴侣查找错误")
	}
}
func TestNodeChildren(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	n := Node{}
	n.N = "test"
	n.Save()
	p := n.Add("c", Data{N: "test的子女"})
	fp, err := n.Children()
	if err != nil || p.Id != fp[0].Id {
		t.Errorf("伴侣查找错误")
	}
}
func TestNodeRoot(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	n := Node{}
	n.N = "test"
	n.Save()
	p := n.Add("c", Data{N: "test的子女"})
	r := p.Root(3)
	if r.Id != n.Id {
		t.Errorf("root查找错误")
	}
}
