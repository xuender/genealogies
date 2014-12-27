package web

import (
	"github.com/dchest/captcha"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"log"
	"net/http"
)

// 验证码
type Captcha struct {
	User
	// ID
	CaptchaId string
	// 验证码
	Solution string
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

// 更换图片
func CaptchaReload(params martini.Params, w http.ResponseWriter) {
	captcha.Reload(params["id"])
	CaptchaImage(params, w)
}

// 图片验证
func CaptchaCheck(c Captcha, r render.Render) {
	log.Println("CaptchaCheck")
	if !captcha.VerifyString(c.CaptchaId, c.Solution) {
		m := Msg{
			Ok:  false,
			Err: "验证码错误",
			Cid: captcha.NewLen(4),
		}
		r.JSON(200, m)
	}
}
