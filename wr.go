package main

import (
	"./base"
	"./web"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
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
	m.Post("/login", binding.Bind(web.User{}), web.UserLogin)
	// 用户注册
	m.Post("/register", binding.Bind(web.User{}), web.UserRegister)
	// 获取用户信息
	m.Get("/login", web.AuthJson, web.UserGet)
	// 用户登出
	m.Get("/logout", web.AuthJson, web.LogCreate("登出"), web.UserLogout)
	// 修改密码
	m.Post("/password", web.AuthJson, web.LogCreate("修改密码"), binding.Bind(web.Password{}), web.UserPassword)
	// 日志查询
	m.Post("/logs", web.AuthJson, binding.Bind(web.Params{}), web.LogQuery)
	m.NotFound(func(r render.Render) {
		r.HTML(404, "404", nil)
	})
	// 端口号
	//http.ListenAndServe(fmt.Sprintf(":%d", base.BaseConfig.Web.Port), m)
	m.Run()
}
