package clan

import (
	"../base"
	"../web"
	"testing"
)

func TestInfoFind(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	u := web.User{
		Phone: "110",
		Name:  "李四",
	}
	u.New()
	i := Info{
		Id: u.Id,
	}
	err := i.Find()
	if err != nil {
		t.Errorf("info查找错误:%s", err)
	}
}
