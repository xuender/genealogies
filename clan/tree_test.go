package clan

import (
	"../base"
	"testing"
)

func TestTreeNew(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	d := Data{
		N: "xcy",
		T: "110",
	}
	r := Tree{
		Data: d,
	}
	err := r.New()
	if err != nil {
		t.Errorf("tree保存错误:%s", err)
	}
}
func TestTreeRead(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	n := Node{}
	n.N = "test"
	n.Save()
	n.Add("p", Data{N: "test的伴侣"})
	n.Add("p", Data{N: "test的伴侣"})
	n.Add("p", Data{N: "test的伴侣"})
	n.Add("c", Data{N: "test的子女"})
	n.Add("c", Data{N: "test的子女"})
	c3 := n.Add("c", Data{N: "test的子女"})
	c3.Add("c", Data{N: "test的孙子"})
	c3.Add("c", Data{N: "test的孙子"})
	tt := Tree{
		Id: n.Id,
	}
	tt.Read(4, n.Id)
	if len(tt.C) != 3 {
		t.Errorf("tree read错误")
	}
	t2 := Tree{
		Id: c3.Id,
	}
	err := t2.New()
	if err != nil {
		t.Errorf("tree保存错误:%s", err)
	}
	if len(t2.C) != 3 {
		t.Errorf("tree new 错误")
	}

}
