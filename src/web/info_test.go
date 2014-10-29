package web

import (
	"testing"
	//	log "github.com/Sirupsen/logrus"
)

func TestInfoJson(t *testing.T) {
	s := Connect()
	defer s.Close()
	DB = GetDb(s)
	//DB.DropDatabase()
	Register("112", "ender", "123")
	//info := InfoNew(u)
	//log.Info(info.Json())
}
