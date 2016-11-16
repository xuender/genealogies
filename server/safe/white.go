package safe

import (
	"log"
	"net/http"
	"os"

	"crypto/md5"

	"encoding/hex"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
)

var stdlog, errlog *log.Logger

func init() {
	stdlog = log.New(os.Stdout, "", log.Ldate|log.Ltime)
	errlog = log.New(os.Stderr, "", log.Ldate|log.Ltime)
}

// 白名单
type White struct {
	// 名单列表
	Ips []string
	// 密钥
	Key string
	// 令牌
	token string
}

// 过滤器
func (w *White) Filter() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 白名单过滤
		if len(w.Ips) > 0 {
			for _, ip := range w.Ips {
				if c.ClientIP() == ip {
					c.Next()
					return
				}
			}
		}
		// 初始化令牌
		if w.token == "" {
			w.token = uuid.NewV4().String()
		}
		// 密码认证
		pass := c.DefaultQuery("pass", "")
		if pass != "" {
			// MD5 认证
			hash := md5.New()
			hash.Write([]byte(w.token + w.Key))
			cipherText := hash.Sum(nil)
			hexText := make([]byte, 32)
			hex.Encode(hexText, cipherText)
			if strings.EqualFold(pass, string(hexText)) {
				// 增加白名单
				w.Ips = append(w.Ips, c.ClientIP())
				stdlog.Printf("增加白名单: %s\n", c.ClientIP())
				c.Next()
				return
			}
		}
		// 失败的访问
		errlog.Printf("white list: %s\n", c.ClientIP())
		c.JSON(http.StatusOK, gin.H{"success": false, "error": "ERROR IP:" + c.ClientIP(), "token": w.token})
		c.Abort()
	}
}
