package web

import (
	"../base"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

func TestPostNew(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	p := Post{
		Type: "bug",
	}
	err := p.New()
	if err == nil {
		t.Errorf("标题失败")
	}
	p.Title = "test"
	p.Uid = bson.NewObjectId()
	err = p.New()
	if err != nil {
		t.Errorf("创建失败")
	}
}
func TestPosReply(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	p := Post{
		Type:  "bug",
		Title: "test",
		Uid:   bson.NewObjectId(),
	}
	p.New()
	err := p.Reply("rrr")
	if err != nil {
		t.Errorf("回复失败:%s", err.Error())
	}
}
func TestPostQuery(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	uid := bson.NewObjectId()
	p := Post{
		Uid:   uid,
		Title: "t",
		Type:  "b",
	}
	p.New()
	p.Status = 2
	p.Reply("xxx")
	p1 := Post{
		Uid:   uid,
		Title: "t",
		Type:  "b",
	}
	p1.New()
	pa := Params{
		Page:   1,
		Count:  100,
		Filter: map[string]interface{}{"status": 2},
	}
	ls, _, err := p.Query(pa)
	if err != nil {
		t.Errorf("查询成功")
	}
	if len(ls) != 1 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
}
