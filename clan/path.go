package clan

import (
	"../web"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
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
	// 修改节点
	m.Put(p+"/node/:id", web.AuthJson, binding.Bind(Data{}), NodeUpdate)
	// 删除节点
	m.Delete(p+"/node/:id", web.AuthJson, NodeRemove)
	// 增加节点
	m.Post(p+"/node/:id/:type", web.AuthJson, binding.Bind(Data{}), NodeAdd)
	// 增加子女
	m.Put(p+"/children/:id", web.AuthJson, binding.Bind([]Id{}), NodeChild)
}
