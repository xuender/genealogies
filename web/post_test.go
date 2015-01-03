package web

import (
	"../base"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

func TestPostNew(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
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
func TestPostQuery(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	u := User{
		Phone: "123",
	}
	u.New()
	uid := u.Id
	p := Post{
		Uid:   uid,
		Title: "t",
		Type:  "b",
	}
	p.New()
	p.Status = 2
	p.Save()
	p1 := Post{
		Uid:   uid,
		Title: "t",
		Type:  "b",
	}
	p1.New()
	pa := base.Params{
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
