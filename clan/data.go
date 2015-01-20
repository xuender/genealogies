package clan

import "time"

// 人员基本信息
type Data struct {
	// 姓名
	N string `bson:"n"`
	// 性别 true男 false女
	G bool `bson:"g"`
	// 生日
	B time.Time `bson:"b"`
	// 在世
	L bool `bson:"l"`
	// 忌日
	D time.Time `bson:"d,omitempty"`
	// 电话
	T string `bson:"t"`
	// 称谓
	E string `bson:"e,omitempty"`
}
