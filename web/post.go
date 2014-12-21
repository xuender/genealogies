package web

import (
	"errors"
	"gopkg.in/mgo.v2/bson"
	"time"
)

// 帖子
type Post struct {
	Id bson.ObjectId `bson:"_id,omitempty" json:"-"`
	// 标题
	Title string `bson:"title,omitempty" json:"title"`
	// 分类
	Type string `bson:"type,omitempty" json:"type"`
	// 内容
	Content string `bson:"content,omitempty" json:"content"`
	// 网址
	Url string `bson:"url,omitempty" json:"url"`
	// 用户ID
	Uid bson.ObjectId `bson:"uid,omitempty" json:"-"`
	// 用户
	User User `bson:",omitempty" json:"-"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
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
	if p.Content == "" {
		return errors.New("内容不能为空")
	}
	if !p.Uid.Valid() {
		return errors.New("用户不能为空")
	}
	c := DB.C("post")
	p.Id = bson.NewObjectId()
	p.Ca = time.Now()
	return c.Insert(p)
}

// 最后几条
func (p *Post) Top(size int) (posts []Post, err error) {
	if p.Type == "" {
		err = errors.New("分类不能为空")
		return
	}
	q := DB.C("post").Find(bson.M{"type": p.Type})
	err = q.Sort("-ca").Limit(size).All(&posts)
	return
}
