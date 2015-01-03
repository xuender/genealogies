package base

import (
	"testing"
)

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
