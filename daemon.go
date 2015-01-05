package main

import (
	"./base"
	"log"
	"net"
	"net/http"
	"net/rpc"
)

type Test struct {
}

func (t *Test) New(name string, ret *string) error {
	*ret = "你好" + name
	return nil
}

func main() {
	base.LogDev()
	log.Println("启动")
	rpc.Register(new(Test))
	rpc.HandleHTTP()
	l, err := net.Listen("tcp", ":1234")
	if err != nil {
		log.Println("监听失败，端口可能已经被占用")
	}
	log.Println("正在监听1234端口")
	http.Serve(l, nil)
}
