package web

import (
	"github.com/martini-contrib/sessions"
	"log"
)

// 网站用户
type Guest struct {
	User
}

// 用户注册
//func GuestRegister(info User)(Guest, error){
//}
//// 查找用户
//func GuestFind(phone string) (Guest, error){
//}
// 登录
func LoginHandle(session sessions.Session, lf LoginForm) string {
	log.Printf("用户登陆:%s\n", lf.Phone)
	//ret := make(map[string]interface{})
	//s, u, err := Login(lf.Phone, lf.Password)
	//if err != nil {
	//	ret["ok"] = false
	//	ret["err"] = err.Error()
	//	res, _ := json.Marshal(ret)
	//	return string(res)
	//}
	//session.Set("id", s.Id.Hex())
	//session.Set("key", s.Key.Hex())
	////ret["id"] = s.Id.Hex()
	//ret["user"] = u
	//ret["ok"] = true
	//res, _ := json.Marshal(ret)
	//return string(res)
	return lf.Phone
}
