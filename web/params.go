package web

import (
	"gopkg.in/mgo.v2/bson"
	"log"
)

// 查询参数
type Params struct {
	// 页码从1开始
	Page int
	// 每页大小
	Count int
	// 排序
	Sorting []string
	// 过滤
	Filter map[string]interface{}
}

// 起始
func (p *Params) Skip() int {
	return (p.Page - 1) * p.Count
}

// 页面数量限制
func (p *Params) Limit() int {
	return p.Count
}

// 排序
func (p *Params) Sort(def string) string {
	if len(p.Sorting) == 0 {
		return def
	}
	return p.Sorting[0]
}

// 查找条件
func (p *Params) Find(m bson.M) {
	for k, v := range p.Filter {
		switch v.(type) {
		case string:
			if v.(string) != "" {
				m[k] = bson.RegEx{Pattern: v.(string), Options: "i"}
			}
		case int:
			m[k] = v.(int)
		case bool:
			m[k] = v.(bool)
		}
	}
	log.Println(m)
}
