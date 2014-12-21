package web

import (
	"testing"
)

// 页面新建
func TestPageNew(t *testing.T) {
	p := PageNew("test")
	if p.Title != "test" {
		t.Errorf("页面创建错误:%s", p.Title)
	}
}
