package base

import (
	"gopkg.in/mgo.v2/bson"
	"testing"
	"time"
)

type TestObj struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"id" table:"to"`
	// 标题
	Title string `bson:"title" json:"title"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
	// 创建时间
	Ua time.Time `bson:"ua,omitempty" json:"ua"`
}
type TestObj2 struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"id" table:"to2"`
	// 标题
	Title string `bson:"title" json:"title"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
	// 创建时间
	Ua time.Time `bson:"ua,omitempty" json:"ua"`
	// 删除时间
	Ra time.Time `bson:"ra,omitempty" json:"ra"`
}

// 保存
func TestSave(t *testing.T) {
	DbTest()
	defer DbClose()
	o := TestObj{
		Title: "123",
	}
	Save(&o)
	if !o.Id.Valid() {
		t.Errorf("主键错误")
	}
}

// 查找
func TestFind(t *testing.T) {
	DbTest()
	defer DbClose()
	o := TestObj{
		Title: "123",
	}
	Save(&o)
	n := TestObj{
		Id: o.Id,
	}
	Find(&n)
	if n.Title != "123" {
		t.Errorf("查找错误")
	}
}

// 查找M
func TestFindM(t *testing.T) {
	DbTest()
	defer DbClose()
	o := TestObj{
		Title: "123",
	}
	Save(&o)
	n := TestObj{}
	m := make(map[string]interface{})
	m["title"] = "123"
	FindM(&n, m)
	if n.Title != "123" {
		t.Errorf("查找错误")
	}
}

// 删除
func TestRemove(t *testing.T) {
	DbTest()
	defer DbClose()
	o := TestObj{
		Title: "123",
	}
	Save(&o)
	err := Remove(&o)
	if err != nil {
		t.Errorf("删除错误")
	}
}

// 删除2
func TestRemove2(t *testing.T) {
	DbTest()
	defer DbClose()
	o := TestObj2{
		Title: "123",
	}
	Save(&o)
	err := Remove(&o)
	if err != nil {
		t.Errorf("删除错误")
	}
	n := TestObj2{
		Id: o.Id,
	}
	Find(&n)
	if n.Title != "123" {
		t.Errorf("虚拟删除错误")
	}
}
