package main

import (
	"./base"
	"./web"
	"log"
	//"net/http"
	"github.com/dchest/captcha"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
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
	m.Use(render.Renderer(render.Options{
		Layout: "layout",
		Delims: render.Delims{"{[{", "}]}"},
	}))
	store := sessions.NewCookieStore([]byte("xuender@gmail.com"))
	m.Use(sessions.Sessions("f_session", store))
	// 首页
	m.Get("/", func(r render.Render) {
		r.HTML(200, "index", map[string]interface{}{
			"title": "测试",
			"c": web.Captcha{
				CaptchaId: captcha.NewLen(4),
			},
		})
	})
	// 后台管理
	m.Get("/manager", func(r render.Render) {
		r.HTML(200, "manager", map[string]interface{}{
			"title": "后台管理",
			"c": web.Captcha{
				CaptchaId: captcha.NewLen(4),
			},
		})
	})
	// 手机、密码登录
	m.Post("/login", binding.Bind(web.Captcha{}),
		web.CaptchaCheck, web.UserLogin)
	// 用户注册
	m.Post("/register", binding.Bind(web.Captcha{}),
		web.CaptchaCheck, web.UserRegister)
	// 获取用户信息
	m.Get("/login", web.AuthJson, web.UserGet)
	// 用户登出
	m.Get("/logout", web.AuthJson, web.LogCreate("登出"), web.UserLogout)
	// 修改密码
	m.Post("/password", web.AuthJson, web.LogCreate("修改密码"), binding.Bind(web.Password{}), web.UserPassword)
	// 日志查询
	m.Post("/logs", web.AuthJson, binding.Bind(web.Params{}), web.LogQuery)
	// 验证码
	m.Get("/captcha/img/:id", web.CaptchaImage)
	//
	m.Get("/captcha/reload/:id", web.CaptchaReload)
	m.NotFound(func(r render.Render) {
		r.HTML(404, "404", nil)
	})
	// 端口号
	//http.ListenAndServe(":3000", m)
	m.Run()
}
