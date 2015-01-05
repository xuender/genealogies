package main

import (
	"./base"
	"log"
	"net/rpc"
)

func main() {
	base.LogDev()
	log.Println("启动")
	client, err := rpc.DialHTTP("tcp", "127.0.0.1:1234")
	if err != nil {
		log.Println("链接rpc服务器失败:", err)
	}
	var str string
	err = client.Call("Test.New", "nn", &str)
	if err != nil {
		log.Println("调用远程服务失败", err)
	}
	log.Println("远程服务返回结果：", str)
}
