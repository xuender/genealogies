package web

import (
	"../base"
	"errors"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

const (
	新建 = iota
	受理
	拒绝
	解决
)

// 帖子
type Post struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"id" table:"post"`
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
	p.Read = true
	p.Status = 新建
	return p.Save()
}

// 查找
func (p *Post) Find() error {
	return base.Find(p)
}

// 查找
func (p *Post) Remove() error {
	return base.Remove(p)
}

// 保存
func (p *Post) Save() error {
	return base.Save(p)
}

// 查询
func (i *Post) Query(p base.Params) (posts []Post, count int, err error) {
	m := make(map[string]interface{})
	if i.Uid.Valid() {
		m["uid"] = i.Uid
	}
	count, err = p.QueryM(i, "-ca", &posts, m)
	for l, post := range posts {
		post.User.Id = post.Uid
		post.User.Find()
		posts[l] = post
	}
	return
}

// 查询
//func (i *Post) Query(p Params) (posts []Post, count int, err error) {
//	m := bson.M{}
//	if i.Uid.Valid() {
//		m["uid"] = i.Uid
//	}
//	p.Find(m)
//	q := DB.C(postName).Find(m)
//	count, err = q.Count()
//	if err == nil && count > 0 {
//		err = q.Sort(p.Sort("-ca")).Skip(p.Skip()).Limit(p.Limit()).All(&posts)
//	}
//	for i, p := range posts {
//		p.User.Id = p.Uid
//		p.User.Find()
//		posts[i] = p
//	}
//	return
//}

// 新增帖子
func PostNew(l Log, s Session, p Post, r render.Render) {
	log.Printf("post title:%s\n", p.Title)
	p.Uid = s.Uid
	ret := Msg{}
	err := p.New()
	ret.Ok = err == nil
	if !ret.Ok {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
	l.Log(p.Id, "反馈新增")
}

// 修改帖子
func PostUpdate(l Log, p Post, r render.Render) {
	p.Read = false
	ret := Msg{}
	err := p.Save()
	ret.Ok = err == nil
	if !ret.Ok {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
	l.Log(p.Id, "反馈修改")
}

// 帖子阅读
func PostRead(l Log, params martini.Params, r render.Render) {
	p := Post{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := p.Find()
	if err == nil {
		p.Read = true
		err = p.Save()
	}
	ret := Msg{}
	ret.Ok = err == nil
	if !ret.Ok {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
	l.Log(p.Id, "反馈阅读")
}

// 帖子删除
func PostRemove(l Log, params martini.Params, r render.Render) {
	p := Post{
		Id: bson.ObjectIdHex(params["id"]),
	}
	err := p.Find()
	if err == nil {
		err = p.Remove()
		l.Log(p.Id, "反馈删除")
	}
	ret := Msg{}
	ret.Ok = err == nil
	if !ret.Ok {
		ret.Err = err.Error()
	}
	r.JSON(200, ret)
}

// 查询帖子
func PostQuery(params base.Params, r render.Render) {
	p := Post{}
	postQuery(p, params, r)
}

// 查询用户帖子
func PostQuery2(session Session, params base.Params, r render.Render) {
	p := Post{
		Uid: session.Uid,
	}
	postQuery(p, params, r)
}
func postQuery(p Post, params base.Params, r render.Render) {
	ret := Msg{}
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
