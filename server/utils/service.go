package utils

import (
	"github.com/takama/daemon"
	"log"
	"os"
	"os/signal"
	"syscall"
)

var stdlog, errlog *log.Logger

func init() {
	stdlog = log.New(os.Stdout, "", log.Ldate|log.Ltime)
	errlog = log.New(os.Stderr, "", log.Ldate|log.Ltime)
}

// 如果服务 install 后 start 错误，则先remove，然后运行 sudo mv /sbin/initctl /sbin/initctl.bak 再 install、start
type Service struct {
	// 服务名称
	Name string
	// 介绍
	Description string
	// 服务运行方法
	Run func()
}

func (service *Service) Manage() (string, error) {
	usage := "Usage: " + service.Name + " install | remove | start | stop | status"
	if len(os.Args) > 1 {
		command := os.Args[1]
		d, err := daemon.New(service.Name, service.Description)
		if err != nil {
			errlog.Fatal("Error: ", err)
		}
		switch command {
		case "install":
			return d.Install()
		case "remove":
			return d.Remove()
		case "start":
			return d.Start()
		case "stop":
			return d.Stop()
		case "status":
			return d.Status()
		default:
			return usage, nil
		}
	}
	// 中断信号
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, os.Kill, syscall.SIGTERM)
	go service.Run()
	for {
		select {
		case killSignal := <-interrupt:
			stdlog.Println("Got signal:", killSignal)
			if killSignal == os.Interrupt {
				return "Daemon was interruped by system signal", nil
			}
			return "Daemon was killed", nil
		}
	}
	return usage, nil
}
