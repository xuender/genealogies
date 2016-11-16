package safe

import (
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"strings"
	"net/http"
)

var stdlog, errlog *log.Logger

func init() {
	stdlog = log.New(os.Stdout, "", log.Ldate | log.Ltime)
	errlog = log.New(os.Stderr, "", log.Ldate | log.Ltime)
}

// 白名单
type White struct {
	// 名单列表
	Ips     []string
	// 增加名单的方法名称
	AddName string
}

// 过滤器
func (w *White) Filter() gin.HandlerFunc {
	return func(c *gin.Context) {
		stdlog.Println(c.Request.URL)
		// 增加白名单方法不用白名单过滤
		if strings.Contains(c.Request.URL.String(), w.AddName) {
			c.Next()
			return
		}
		// 白名单过滤
		if len(w.Ips) > 0 {
			for _, ip := range w.Ips {
				if c.ClientIP() == ip {
					c.Next()
					return
				}
			}
		}
		// 过滤失效
		errlog.Printf("white list: %s\n", c.ClientIP())
		c.JSON(http.StatusOK, gin.H{"success": false, "error":"ERROR IP:" + c.ClientIP() })
		c.Abort()
	}
}
// 增加白名单
func (w *White) Add(c *gin.Context) {
	ip := c.DefaultQuery("ip", "")
	if ip == "" {
		errlog.Println("白名单增加错误")
		c.JSON(http.StatusOK, gin.H{"success": false, "error":"参数错误" })
		return
	}
	stdlog.Printf("增加白名单: %s\n", ip)
	w.Ips = append(w.Ips, ip)
	c.JSON(http.StatusOK, gin.H{"success": true, "message":"白名单增加 IP:" + c.ClientIP() })
}
