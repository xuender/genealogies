package web

// 用户
type User struct {
  // 使用手机登录身份认证
  Phone   string
  Name    string
	Password string
}

// 注册
func Register(phone, name, password string) error {
  // TODO 用户注册
  return nil
}
// 登录
func Login(phone, password string) error {
  // TODO 登陆认证
  return nil
}
