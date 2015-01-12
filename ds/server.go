package ds

import (
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/rpc"
	"os"
	"os/signal"
	"syscall"
	//"github.com/takama/daemon"
	"../../daemon"
)

// 监听服务
type Service struct {
	daemon.Daemon
	port int
}

// 新建监听服务
func New(name, description string, port int) *Service {
	srv, err := daemon.New(name, description)
	if err != nil {
		log.Println("Error: ", err)
		os.Exit(1)
	}
	service := &Service{srv, port}
	return service
}

// 注册
func (service *Service) Register(rcvr interface{}) {
	rpc.Register(rcvr)
}

// 运行
func (service *Service) Run() {
	status, err := service.manage()
	if err != nil {
		log.Println(status, "\nError: ", err)
		os.Exit(1)
	}
	log.Println(status)
}
func (service *Service) manage() (string, error) {
	usage := "Usage: myservice install | remove | start | stop | status"
	if len(os.Args) > 1 {
		command := os.Args[1]
		switch command {
		case "install":
			return service.Install()
		case "remove":
			return service.Remove()
		case "start":
			return service.Start()
		case "stop":
			return service.Stop()
		case "status":
			return service.Status()
		default:
			return usage, nil
		}
	}

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, os.Kill, syscall.SIGTERM)

	rpc.HandleHTTP()
	l, err := net.Listen("tcp", fmt.Sprintf(":%d", service.port))
	if err != nil {
		return usage, errors.New("监听失败，端口可能已经被占用")
	}
	log.Println("正在监听1234端口")
	go http.Serve(l, nil)
	for {
		select {
		case killSignal := <-interrupt:
			log.Println("Got signal:", killSignal)
			log.Println("Stoping listening on ", l.Addr())
			l.Close()
			if killSignal == os.Interrupt {
				return "Daemon was interruped by system signal", nil
			}
			return "Daemon was killed", nil
		}
	}
	return usage, nil
}
