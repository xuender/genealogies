package web

import (
	"../base"
	"gopkg.in/mgo.v2/bson"
	"testing"
)

// 日志查询
func TestLogQuery(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	uid := bson.NewObjectId()
	n := Log{
		Uid:  uid,
		Work: "测试",
	}
	n.Create()
	n = Log{
		Uid:  uid,
		Work: "测试",
	}
	n.Create()
	l := Log{}
	ls, count, err := l.Query(0, 100)
	if err == nil {
		t.Errorf("缺失条件")
	}
	l.Uid = uid
	ls, count, err = l.Query(0, 100)
	if err != nil {
		t.Errorf("查询成功")
	}
	if len(ls) != 2 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
	if count != 2 {
		t.Errorf("count错误:%d", count)
	}
	ls, count, err = l.Query(1, 100)
	if count != 2 {
		t.Errorf("count错误:%d", count)
	}
	if len(ls) != 1 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
	ls, count, err = l.Query(0, 1)
	if count != 2 {
		t.Errorf("count错误:%d", count)
	}
	if len(ls) != 1 {
		t.Errorf("查询数量错误:%d", len(ls))
	}
}

// 日志创建
func TestLogCreate(t *testing.T) {
	s := base.Connect("127.0.0.1")
	defer s.Close()
	DB = s.DB("test")
	DB.DropDatabase()
	uid := bson.NewObjectId()
	n := Log{
		Uid:  uid,
		Work: "测试",
	}
	err := n.Create()
	if err != nil {
		t.Errorf("创建日志失败")
	}
	if n.Uid != uid {
		t.Errorf("用户ID错误")
	}
	err = n.Create()
	if err == nil {
		t.Errorf("id错误")
	}
	n = Log{
		Uid: uid,
	}
	err = n.Create()
	if err == nil {
		t.Errorf("内容不能为空")
	}
	n = Log{
		Work: "xxx",
	}
	err = n.Create()
	if err == nil {
		t.Errorf("用户不能为空")
	}
}
