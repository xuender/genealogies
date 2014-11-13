package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/go-martini/martini"
	//"github.com/martini-contrib/gzip"
	"github.com/martini-contrib/render"
	//"gopkg.in/mgo.v2"
	//"gopkg.in/mgo.v2/bson"
	"./web"
	//"net/http"
	//"fmt"
)

func main() {
	log.SetLevel(log.DebugLevel)
	log.Info("连接数据库")
	s := web.Connect()
	defer s.Close()
	log.Info("记录日志")
	web.DB = web.GetDb(s)
	err := web.AddLog("web", "start")
	if err != nil {
		log.Error(err)
		panic(err)
	}

	log.Info("启动服务")
	m := martini.Classic()
	// gzip支持
	//m.Use(gzip.All())
	// 模板支持
	m.Use(render.Renderer())
	// 手机密码登陆
	m.Post("/login", web.LoginHandle)
	// 已登陆获取用户信息
	m.Get("/login/:id", web.SessionHandle)
	// 退出登陆
	m.Get("/logout/:id", web.LogoutHandle)
	// 获取家谱信息
	m.Get("/info/:id", web.InfoHandle)
	// 修改节点
	m.Post("/node/:id", web.NodeUpdateHandle)
	// 删除节点
	m.Delete("/node/:id", web.NodeDelHandle)
	// 增加节点
	m.Put("/node/:id/:type", web.NodeAddHandle)
	//m.Get("/", func(r render.Render) {
	//  r.HTML(200, "index", {"title":"title index"})
	//})
	m.NotFound(func(r render.Render) {
		r.HTML(404, "404", nil)
	})
	// 端口号
	//http.ListenAndServe(fmt.Sprintf(":%d", base.BaseConfig.Web.Port), m)
	m.Run()
	log.Info("退出")
}
