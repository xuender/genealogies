package web

import (
	"errors"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

const (
	新建 = iota
	待受理
	受理中
	拒绝
	已解决
	postName = "post"
)

// 帖子
type Post struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"-"`
	// 标题
	Title string `bson:"title" json:"title"`
	// 分类
	Type string `bson:"type" json:"type"`
	// 状态
	Status int `bson:"status" json:"status"`
	// 内容
	Content string `bson:"content,omitempty" json:"content"`
	// 回复
	Rt string `bson:"rt,omitempty" json:"rt"`
	// 网址
	Url string `bson:"url,omitempty" json:"url"`
	// 是否阅读
	Read bool `bson:"read,omitempty" json:"read"`
	// 用户ID
	Uid bson.ObjectId `bson:"uid" json:"uid"`
	// 用户
	User User `bson:",omitempty" json:"user"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
	// 创建时间
	Ua time.Time `bson:"ua,omitempty" json:"ua"`
}

// 创建帖子
func (p *Post) New() error {
	if p.Id.Valid() {
		return errors.New("ID错误")
	}
	if p.Type == "" {
		return errors.New("分类不能为空")
	}
	if p.Title == "" {
		return errors.New("标题不能为空")
	}
	if !p.Uid.Valid() {
		return errors.New("用户不能为空")
	}
	c := DB.C(postName)
	p.Id = bson.NewObjectId()
	p.Ca = time.Now()
	p.Read = true
	p.Status = 新建
	return c.Insert(p)
}

// 回复
func (p *Post) Reply(rt string) error {
	p.Rt = rt
	p.Ua = time.Now()
	return DB.C(postName).UpdateId(p.Id, p)
}

// 查询
func (i *Post) Query(p Params) (posts []Post, count int, err error) {
	m := bson.M{}
	if i.Uid.Valid() {
		m["uid"] = i.Uid
	}
	p.Find(m)
	q := DB.C(postName).Find(m)
	count, err = q.Count()
	if err == nil && count > 0 {
		err = q.Sort(p.Sort("-ca")).Skip(p.Skip()).Limit(p.Limit()).All(&posts)
	}
	for i, p := range posts {
		p.User.Id = p.Uid
		p.User.Find()
		posts[i] = p
		log.Println(p.User.Name)
	}
	return
}

// 新增帖子
func PostNew(s Session, post Post, r render.Render) {
	log.Printf("post title:%s\n", post.Title)
	post.Uid = s.Uid
	ret := Msg{}
	err := post.New()
	ret.Ok = err == nil
	if !ret.Ok {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// 查询帖子
func PostQuery(params Params, r render.Render) {
	ret := Msg{}
	p := Post{}
	log.Printf("%s\n", params)
	ls, count, err := p.Query(params)
	log.Printf("count:%d\n", count)
	ret.Ok = err == nil
	if err == nil {
		ret.Count = count
		ret.Data = ls
	} else {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// TODO 增加post创建、查询方法

//// 最后几条
//func (p *Post) Top(size int) (posts []Post, err error) {
//	if p.Type == "" {
//		err = errors.New("分类不能为空")
//		return
//	}
//	q := DB.C(postName).Find(bson.M{"type": p.Type})
//	err = q.Sort("-ca").Limit(size).All(&posts)
//	return
//}
