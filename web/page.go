package web

import (
	"github.com/dchest/captcha"
)

// 页面
type Page struct {
	// 标题
	Title string
	// 验证码字符串
	Cid string
	// 是否是客服
	Cs bool
}

// 新建页面对象
func PageNew(title string, cs bool) (p Page) {
	p.Title = title
	p.Cid = captcha.NewLen(4)
	p.Cs = cs
	return
}
