package web

import (
	log "github.com/Sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

func TestNodeFind(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	c := DB.C("node")
	n := NodeNew(Data{})
	err := c.Insert(&n)
	if err != nil {
		log.Error(err)
		t.Errorf("增加Node失败")
	}
	_, e := NodeFind(n.Id)
	if e != nil {
		log.Error(e)
		t.Errorf("查找Node失败")
	}
}
func TestNodeNew(t *testing.T) {
	n := NodeNew(Data{N: "test"})
	if n.N != "test" {
		t.Errorf("新建Node失败")
	}
}
func TestNodeSave(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	if n.Ca.IsZero() || !n.Ua.IsZero() {
		t.Errorf("新建保存失败")
	}
	n.Save(bson.NewObjectId())
	if n.Ca.IsZero() || n.Ua.IsZero() {
		t.Errorf("新建再次保存失败")
	}
}
func TestNodeAdd(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	if n.Ca.IsZero() || !n.Ua.IsZero() {
		t.Errorf("新建保存失败")
	}
	f := n.Add("f", Data{N: "test的父亲"})
	if f.Ca.IsZero() || f.N != "test的父亲" {
		t.Errorf("增加父亲失败")
	}
	nf := n.Add("f", Data{N: "test的父亲"})
	if f.N != "test的父亲" || f.Id != nf.Id {
		t.Errorf("增加父亲失败")
	}
	p := n.Add("p", Data{N: "test的丈夫"})
	if p.Ca.IsZero() || p.N != "test的丈夫" {
		t.Errorf("增加丈夫失败")
	}
	if len(n.P) != 1 {
		t.Errorf("丈夫数量应该=1")
	}
	n.Add("p", Data{N: "test的丈夫"})
	if len(n.P) != 2 {
		t.Errorf("丈夫数量应该=2")
	}
}
func TestNodeRoot(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	f := n.Add("f", Data{N: "test的父亲"})
	g := f.Add("f", Data{N: "test的父亲"})
	root := n.Root(4)
	if root.Id != g.Id {
		t.Errorf("根节点查找错误")
	}
}
func TestNodePartner(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	p := n.Add("p", Data{N: "test的丈夫"})
	fp, err := n.Partner()
	if err != nil || p.Id != fp[0].Id {
		t.Errorf("伴侣查找错误")
	}
}
func TestNodeChildren(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	f := n.Add("f", Data{N: "test的丈夫"})
	n2 := f.Add("c", Data{N: "儿子"})
	n2.Save(bson.NewObjectId())
	ns, err := f.Children()
	if err != nil || len(ns) != 2 {
		t.Errorf("子女查找错误")
	}
}
func TestNodeAddC(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	f := n.Add("f", Data{N: "test的丈夫"})
	f.Add("c", Data{N: "test的丈夫"})
	ns, err := f.Children()
	if err != nil || len(ns) != 2 {
		t.Errorf("增加子女错误")
	}
}
func TestNodeDel(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetTestDb(s)
	DB.DropDatabase()
	n := NodeNew(Data{N: "test"})
	n.Save(bson.NewObjectId())
	f := n.Add("p", Data{N: "test的丈夫"})
	err := n.Del(bson.NewObjectId())
	if err == nil {
		t.Errorf("有伴侣不能删除")
	}
	err = f.Del(bson.NewObjectId())
	if err != nil {
		t.Errorf("删除失败")
	}
	nf := Node{}
	_ = DB.C("node").FindId(f.Id).One(&nf)
	if nf.Id.Valid() {
		t.Errorf("删除失败,还能找到")
	}
	n.Add("c", Data{N: "test的孩子"})
	ff := n.Add("f", Data{N: "爷爷"})
	if !n.F.Valid() {
		t.Errorf("增加爷爷失败")
	}
	ff.Save(bson.NewObjectId())
	err = ff.Del(bson.NewObjectId())
	if err != nil {
		t.Errorf("删除根节点失败")
	}
	nn, _ := NodeFind(n.Id)
	if nn.F.Valid() {
		t.Errorf("删除根节点，后父节点清空")
	}
}
