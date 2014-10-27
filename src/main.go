package main
import (
  log "github.com/Sirupsen/logrus"
  "github.com/go-martini/martini"
  "github.com/martini-contrib/gzip"
  "github.com/martini-contrib/render"
  "github.com/martini-contrib/sessions"
  //"net/http"
  //"fmt"
)

func main() {
  log.Info("启动")
  m := martini.Classic()
  // sessions
  store := sessions.NewCookieStore([]byte("secret123"))
  m.Use(sessions.Sessions("dou_session", store))
  // gzip支持
  m.Use(gzip.All())
  // 模板支持
  m.Use(render.Renderer())
  // 测试session保存
  m.Get("/set", func(session sessions.Session) string {
    session.Set("id", "world")
    return "OK"
  })
  m.Get("/get", func(session sessions.Session) string {
    v := session.Get("id")
    if v == nil {
      return ""
    }
    return v.(string)
  })
  //m.Get("/", func(r render.Render) {
  //  r.HTML(200, "index", {"title":"title index"})
  //})
  m.NotFound(func(r render.Render) {
    r.HTML(404, "404", nil)
  })
  // 端口号
  //http.ListenAndServe(fmt.Sprintf(":%d", base.BaseConfig.Web.Port), m)
  m.Run()
  log.Info("退出")
}
