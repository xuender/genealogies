package base

import (
	"testing"
)

func TestSliceRemove(t *testing.T) {
	s := []string{"1", "2", "4", "5"}
	SliceRemove(&s, "4")
	if len(s) != 3 {
		t.Errorf("删除错误剩余:%d", len(s))
	}
	if s[2] != "5" {
		t.Errorf("最后数据:%s", s[2])
	}
	SliceRemove(&s, "1")
	if len(s) != 2 {
		t.Errorf("删除错误剩余:%d", len(s))
	}
	if s[1] != "5" {
		t.Errorf("最后数据:%s", s[1])
	}
	SliceRemove(&s, "5")
	if len(s) != 1 {
		t.Errorf("删除错误剩余:%d", len(s))
	}
	if s[0] != "2" {
		t.Errorf("最后数据:%s", s[0])
	}
	SliceRemove(&s, "533")
	if len(s) != 1 {
		t.Errorf("删除错误剩余:%d", len(s))
	}
	if s[0] != "2" {
		t.Errorf("最后数据:%s", s[0])
	}
}
