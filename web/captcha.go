package web

import (
	"github.com/dchest/captcha"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"io"
	"log"
	"net/http"
)

// 验证码
type Captcha struct {
	// ID
	CaptchaId string
	// 验证码
	Solution string
	// 姓名
	Phone string `form:"phone" binding:"required"`
	// 密码
	Password string `form:"password" binding:"required"`
}

// 验证图片
func CaptchaImage(params martini.Params, w http.ResponseWriter) {
	log.Printf("Captcha id:%s", params["id"])
	w.Header().Set("Content-Type", "image/png")
	err := captcha.WriteImage(w, params["id"], 240, 80)
	if err != nil {
		log.Println(err.Error())
	}
}

// shuaxin
func CaptchaReload(params martini.Params, w http.ResponseWriter) {
	captcha.Reload(params["id"])
	CaptchaImage(params, w)
}

// 图片验证
func CaptchaCheck(c Captcha, r render.Render) {
	if !captcha.VerifyString(c.CaptchaId, c.Solution) {
		m := Msg{
			Ok:  false,
			Err: "验证码错误",
			Cid: captcha.NewLen(4),
		}
		r.JSON(200, m)
	}
}
func processFormHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if !captcha.VerifyString(r.FormValue("captchaId"), r.FormValue("captchaSolution")) {
		io.WriteString(w, "Wrong captcha solution! No robots allowed!\n")
	} else {
		io.WriteString(w, "Great job, human! You solved the captcha.\n")
	}
	io.WriteString(w, "<br><a href='/'>Try another one</a>")
}
