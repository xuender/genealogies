package web

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
)

// 网址设置
func Path(m *martini.ClassicMartini, p string) {
	// 首页
	m.Get(p, func(r render.Render) {
		r.HTML(200, "index", PageNew("测试", false))
	})
	// 手机、密码登录
	m.Post(p+"login", binding.Bind(Captcha{}), CaptchaCheck,
		UserLogin)
	// 用户注册
	m.Post(p+"register", binding.Bind(Captcha{}), CaptchaCheck,
		UserRegister)
	// 获取用户信息
	m.Get(p+"login", AuthJson, UserGet)
	// 用户登出
	m.Get(p+"logout", Authorize, LogNew("登出"), UserLogout)
	// 修改密码
	m.Post(p+"password", AuthJson, LogNew("修改密码"),
		binding.Bind(Password{}), UserPassword)
	// 日志查询
	m.Post(p+"logs", AuthJson, binding.Bind(Params{}), LogQuery)
	// 验证码
	m.Get(p+"captcha/img/:id", CaptchaImage)
	// 刷新验证码
	m.Get(p+"captcha/reload/:id", CaptchaReload)
	// 用户反馈
	m.Post(p+"post", AuthJson, binding.Bind(Post{}), PostNew)
	// 历史反馈查询
	m.Post(p+"postq", AuthJson, binding.Bind(Params{}), PostQuery2)
	// 用户读取
	m.Get(p+"post/:id", AuthJson, PostRead)
}

// 客服网址
func CsPath(m *martini.ClassicMartini, p string) {
	// 客服
	m.Get(p, func(r render.Render) {
		r.HTML(200, "cs", PageNew("客户服务", true))
	})
	// 查询用户列表
	m.Post(p+"/users", ManagerJson, binding.Bind(Params{}), UserQuery)
	// 查询会话列表
	m.Post(p+"/session", ManagerJson, binding.Bind(Params{}),
		SessionQuery)
	// 删除会话
	m.Delete(p+"/session/:id", ManagerJson, LogNew("会话删除"),
		SessionRemove)
	// 查询用户反馈列表
	m.Post(p+"/post", ManagerJson, binding.Bind(Params{}), PostQuery)
	// 反馈修改
	m.Put(p+"/post", ManagerJson, binding.Bind(Post{}), PostUpdate)
	// 删除反馈
	m.Delete(p+"/post/:id", ManagerJson, PostRemove)
	// 日志列表
	m.Post(p+"/logs/:oid", ManagerJson, binding.Bind(Params{}), LogList)
}
