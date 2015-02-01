package clan

import (
	"../base"
	"testing"
)

func TestCountLast(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	o := Count{
		UserSum: 3,
		UserAdd: 1,
	}
	o.Save()
	c := Count{}
	err := c.Last()
	if err != nil {
		t.Errorf("Count查找错误:%s", err)
	}
}

func TestCountNew(t *testing.T) {
	base.DbTest()
	defer base.DbClose()
	o := Count{
		UserSum: 3,
		UserAdd: 1,
	}
	o.Save()
	c := Count{}
	err := c.New()
	if err != nil {
		t.Errorf("Count查找错误:%s", err)
	}
	if c.UserAdd != -3 {
		t.Errorf("Count统计错误: %d", c.UserAdd)
	}
}
