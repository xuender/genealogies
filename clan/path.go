package clan

import (
	"../web"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

// 网址设置
func Path(m *martini.ClassicMartini, p string) {
	// 首页
	m.Get(p, func(r render.Render) {
		r.HTML(200, "clan", web.PageNew("家族", false))
	})
	// 获取用户信息树
	m.Get(p+"/info", web.AuthJson, InfoGet)
}
