package main

import (
	"./base"
	"./web"
	"github.com/go-martini/martini"
	bind "github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"log"
)

func main() {
	//base.LogInit("/tmp/a.log")
	base.LogDev()
	log.Println("网站对外运行环境，启动...")
	defer log.Println("系统关闭")
	log.Println("连接数据库.")
	s := base.Connect("127.0.0.1")
	defer s.Close()
	web.DB = s.DB("family")
	log.Println("启动WEB服务.")
	m := martini.Classic()
	m.Use(render.Renderer())
	store := sessions.NewCookieStore([]byte("xuender@gmail.com"))
	m.Use(sessions.Sessions("f_session", store))
	// 手机、密码登录
	m.Post("/login", bind.Bind(web.User{}), web.UserLogin)
	m.NotFound(func(r render.Render) {
		r.HTML(404, "404", nil)
	})
	// 端口号
	//http.ListenAndServe(fmt.Sprintf(":%d", base.BaseConfig.Web.Port), m)
	m.Run()
}
