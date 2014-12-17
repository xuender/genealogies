package web

import (
	"gopkg.in/mgo.v2/bson"
	"testing"
)

func TestParamsFind(t *testing.T) {
	m := bson.M{}
	p := Params{
		Filter: map[string]string{"a": "aa", "b": "bb", "c": ""},
	}
	p.Find(m)
	if len(m) != 2 {
		t.Errorf("条件数量错误:%d", len(m))
	}
}
func TestParamsSkip(t *testing.T) {
	p := Params{
		Page:  3,
		Count: 100,
	}
	if p.Skip() != 200 {
		t.Errorf("Skip错误")
	}
}
func TestParamsLimit(t *testing.T) {
	p := Params{
		Page:  3,
		Count: 100,
	}
	if p.Limit() != 100 {
		t.Errorf("Limit错误")
	}
}
func TestParamsSort(t *testing.T) {
	p := Params{
		Page:  3,
		Count: 100,
	}
	if p.Sort("def") != "def" {
		t.Errorf("def错误")
	}
	p.Sorting = []string{"ca"}
	if p.Sort("def") != "ca" {
		t.Errorf("sort错误")
	}
}
