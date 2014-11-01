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
	_, e := NodeFind(n.Id.Hex())
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
