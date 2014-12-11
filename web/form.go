package web

// 用户登录信息
type LoginForm struct {
	Phone    string `form:"phone" binding:"required"`
	Password string `form:"password" binding:"required"`
}
