package clan

import (
	"../base"
	"../web"
	"errors"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

// 用户信息
type Info struct {
	Id bson.ObjectId `bson:"_id,omitempty" table:"info"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
	// 修改时间
	Ua time.Time `bson:"ua,omitempty" json:"ua"`
	// 树状信息
	T Tree `json:"t"`
}

// 删除
func (i *Info) Remove() error {
	return base.Remove(i)
}

// 删除用户信息
func InfoRemove(session web.Session) error {
	log.Println("删除info:", session.Uid)
	i := Info{
		Id: session.Uid,
	}
	return i.Remove()
}

// 保存
func (i *Info) Save() error {
	return base.Save(i)
}

// 查找用户信息
func (i *Info) Find() (err error) {
	//base.Remove(i)
	if i.Id.Valid() {
		//if true {
		err = base.Find(i)
		if err != nil {
			u := web.User{
				Id: i.Id,
			}
			err = u.Find()
			i.T.Id = i.Id
			i.T.N = u.Name
			i.T.T = u.Phone
			i.T.L = true
			i.T.New()
			i.T.Title()
			i.Save()
		}
		return
	}
	return errors.New("条件不具足，无法查找.")
}

// 获取信息
func InfoGet(s web.Session, r render.Render) {
	i := Info{
		Id: s.Uid,
	}
	err := i.Find()
	ret := web.Msg{}
	ret.Ok = err == nil
	if err == nil {
		ret.Data = i
		//i.T.Node.Add("c", Data{N: "子女"})
		//i.T.Node.Add("p", Data{N: "伴侣"})
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}
