package web

import (
	"../base"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

// 日志查询
func TestLogQuery(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	uid := bson.NewObjectId()
	n := Log{
		Uid:  uid,
		Work: "测试",
	}
	n.New()
	n = Log{
		Uid:  uid,
		Work: "测试",
	}
	n.New()
	l := Log{}
	p := base.Params{
		Page:  1,
		Count: 100,
	}
	ls, count, err := l.Query(p)
	if err == nil {
		t.Errorf("缺失条件")
	}
	l.Uid = uid
	ls, count, err = l.Query(p)
	if err != nil {
		t.Errorf("查询成功")
	}
	if len(ls) != 2 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
	if count != 2 {
		t.Errorf("count错误:%d", count)
	}
	p.Page = 2
	p.Count = 1
	ls, count, err = l.Query(p)
	if count != 2 {
		t.Errorf("count错误:%d", count)
	}
	if len(ls) != 1 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
	p.Page = 1
	p.Count = 1
	ls, count, err = l.Query(p)
	if count != 2 {
		t.Errorf("count错误:%d", count)
	}
	if len(ls) != 1 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
}

// 日志创建
func TestLogNew(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	uid := bson.NewObjectId()
	n := Log{
		Uid:  uid,
		Work: "测试",
	}
	err := n.New()
	if err != nil {
		t.Errorf("创建日志失败")
	}
	if n.Uid != uid {
		t.Errorf("用户ID错误")
	}
	err = n.New()
	if err == nil {
		t.Errorf("id错误")
	}
	n = Log{
		Uid: uid,
	}
	err = n.New()
	if err == nil {
		t.Errorf("内容不能为空")
	}
	n = Log{
		Work: "xxx",
	}
	err = n.New()
	if err == nil {
		t.Errorf("用户不能为空")
	}
}
