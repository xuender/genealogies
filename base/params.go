package base

import (
	"gopkg.in/mgo.v2/bson"
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
func (p *Params) Query(i interface{}, sort string,
	list interface{}) (int, error) {
	m := bson.M{}
	return p.query(i, sort, list, m)
}
func (p *Params) query(i interface{}, sort string, list interface{},
	m bson.M) (count int, err error) {
	for k, v := range p.Filter {
		switch v.(type) {
		case string:
			if v.(string) != "" {
				m[k] = bson.RegEx{Pattern: v.(string), Options: "i"}
			}
		case int:
			m[k] = v.(int)
		case uint:
			m[k] = v.(uint)
		case float64:
			m[k] = v.(float64)
		case bool:
			m[k] = v.(bool)
		}
	}
	o, err := findObj(i)
	if err != nil {
		return
	}
	q := dbDB.C(o.Name).Find(m)
	count, err = q.Count()
	if err == nil && count > 0 {
		err = q.Sort(p.Sort(sort)).Skip(p.Skip()).Limit(p.Limit()).All(list)
	}
	return
}

// 查找条件
func (p *Params) QueryM(i interface{}, sort string, list interface{},
	in map[string]interface{}) (int, error) {
	m := bson.M{}
	for k, v := range in {
		m[k] = v
	}
	return p.query(i, sort, list, m)
}
