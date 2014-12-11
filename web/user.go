package web

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 用户
type User struct {
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 手机
	Phone string
	// 姓名
	Name string
	// 是否是管理员
	IsManager bool
	// 创建时间
	Ca time.Time
	// 修改时间
	Ua time.Time
	// 有效标记
	En bool
}

// 用户禁用
func (u *User) Disable() {
	u.En = false
	// TODO 保存
}
