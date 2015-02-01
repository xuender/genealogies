package clan

import (
	"../base"
	"../web"
	"github.com/martini-contrib/render"
	"github.com/robfig/cron"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

// 统计
type Count struct {
	Id bson.ObjectId `bson:"_id,omitempty" table:"count"`
	// 总注册人数
	UserSum int `bson:"usum"`
	// 增加人数
	UserAdd int `bson:"uadd"`
	// 总节点数
	NodeSum int `bson:"nsum"`
	// 增加节点数
	NodeAdd int `bson:"nadd"`
	// 创建时间
	Ca time.Time `bson:"ca,omitempty" json:"ca"`
}

// 保存
func (c *Count) Save() error {
	return base.Save(c)
}

//新建统计
func (c *Count) New() error {
	u := web.User{}
	c.UserSum = u.Sum()
	n := Node{}
	c.NodeSum = n.Sum()
	l := Count{}
	err := l.Last()
	if err == nil {
		c.UserAdd = c.UserSum - l.UserSum
		c.NodeAdd = c.NodeSum - l.NodeSum
	} else {
		c.UserAdd = 0
		c.NodeAdd = 0
	}
	return c.Save()
}

// 左后一个
func (c *Count) Last() error {
	m := bson.M{}
	return base.FindM(c, m, "-ca")
}

// 查询
func (c *Count) Query() (counts []Count) {
	m := bson.M{}
	p := base.Params{
		Count: 10,
		Page:  1,
	}
	p.QueryM(c, "-ca", &counts, m)
	return
}
func init() {
	c := cron.New()
	//凌晨统计
	c.AddFunc("5 0 0 * * ?", func() {
		//c.AddFunc("5 24 20 * * ?", func() {
		log.Println("定时统计")
		count := Count{}
		count.New()
	})
	c.Start()
}

// 统计查询
func CountQuery(r render.Render) {
	ret := web.Msg{}
	ret.Ok = true
	ret.Data = new(Count).Query()
	r.JSON(200, ret)
}
