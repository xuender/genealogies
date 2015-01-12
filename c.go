package main

import (
	"./base"
	"./fr"
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
	var count int
	err = client.Call("Ctrl.NasInfo", fr.Count, &count)
	if err != nil {
		log.Println("调用远程服务失败", err)
	}
	log.Println("远程服务返回结果：", count)
	var ns []fr.Nas
	err = client.Call("Ctrl.NasFind", 0, &ns)
	if err != nil {
		log.Println("调用远程服务失败", err)
	}
	for _, n := range ns {
		log.Println("ns id:", n.Id, " name:", n.Nasname)
		log.Println(n)
	}
}
