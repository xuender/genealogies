package main
import (
  log "github.com/Sirupsen/logrus"
  "github.com/go-martini/martini"
  "github.com/martini-contrib/gzip"
  "github.com/martini-contrib/render"
  //"net/http"
  //"fmt"
)

func main() {
  log.Info("启动")
  m := martini.Classic()
  // gzip支持
  m.Use(gzip.All())
  // 模板支持
  m.Use(render.Renderer())
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
