package web

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 节点
type Node struct {
	// 基本信息
	Data
	Id bson.ObjectId `bson:"_id,omitempty"`
	// 父亲
	F bson.ObjectId `bson:"f,omitempty"`
	// 母亲
	M bson.ObjectId `bson:"m,omitempty"`
	// 伴侣
	P bson.ObjectId `bson:"p,omitempty"`
	//// 其他父亲
	//Fs []bson.ObjectId `bson:"fs,omitempty"`
	//// 其他母亲
	//Ms []bson.ObjectId `bson:"ms,omitempty"`
	//// 其他伴侣
	//ps []bson.ObjectId `bson:"ps,omitempty"`
	// 有效标记
	E bool
	// 创建时间
	Ca time.Time
	// 创建人
	Cb bson.ObjectId `bson:"cb,omitempty"`
	// 修改时间
	Ua time.Time
	// 修改人
	Ub bson.ObjectId `bson:"ub,omitempty"`
}

// 设置父亲
func (i *Node) SetF(n string) Node {
	return Node{}
}

// 设置母亲
func (i *Node) SetM(n string) Node {
	return Node{}
}

// 设置伴侣
func (i *Node) SetP(n string) Node {
	return Node{}
}

// 增加子女
func (i *Node) AddC(n string) Node {
	return Node{}
}
