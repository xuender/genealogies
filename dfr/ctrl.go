package dfr

import (
	"../fr"
)

// 控制器
type Ctrl struct {
}

// 表格信息
func (c *Ctrl) NasInfo(info int, ret *int) (err error) {
	//nas := fr.Nas{}
	switch info {
	case fr.Count:
		db.Table("nas").Count(ret)
	default:
		*ret = 0
	}
	return
}

// 查询Nas
func (c *Ctrl) NasFind(start int, ret *[]fr.Nas) (err error) {
	db.Where("id > ?", start).Find(ret)
	return
}
