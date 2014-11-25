package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	//"github.com/martini-contrib/gzip"
	bind "github.com/martini-contrib/binding"
	"github.com/martini-contrib/sessions"
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
	// session
	store := sessions.NewCookieStore([]byte("xuender@gmail.com"))
	m.Use(sessions.Sessions("p_session", store))
	// 手机、密码登陆
	m.Post("/login", bind.Bind(web.LoginForm{}), web.LoginHandle)
	// 已登陆获取用户信息
	m.Get("/login", web.SessionHandle)
	// 退出登陆
	m.Get("/logout", web.LogoutHandle)
	// 获取家谱信息
	m.Get("/info/:id", web.Authorize, web.InfoHandle)
	// 修改节点
	m.Post("/node/:id", web.Authorize, bind.Bind(web.Data{}), web.NodeUpdateHandle)
	// 删除节点
	m.Delete("/node/:id", web.Authorize, web.NodeDelHandle)
	// 删除伴侣节点
	m.Delete("/node/:id/:pid", web.Authorize, web.NodePDelHandle)
	// 增加节点
	m.Put("/node/:id/:type", web.Authorize, bind.Bind(web.Data{}), web.NodeAddHandle)
	// 设置子女
	m.Post("/node/:id", web.Authorize, bind.Bind([]string{}), web.NodeChildHandle)
	m.NotFound(func(r render.Render) {
		r.HTML(404, "404", nil)
	})
	// 端口号
	//http.ListenAndServe(fmt.Sprintf(":%d", base.BaseConfig.Web.Port), m)
	m.Run()
	log.Info("退出")
}
