package web

import (
	"testing"
)

// 用户禁用
func TestUserDisable(t *testing.T) {
	var u User
	u.En = true
	u.Disable()
	if u.En {
		t.Errorf("禁用失败")
	}
}
