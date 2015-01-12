package dfr

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"log"
	"os"
)

var db gorm.DB

func init() {
	d, err := gorm.Open("mysql", "root:xcy123@/radius?charset=utf8&parseTime=True")
	if err != nil {
		log.Println("Error: ", err)
		os.Exit(1)
	}
	d.DB()

	d.DB().Ping()
	d.DB().SetMaxIdleConns(10)
	d.DB().SetMaxOpenConns(100)

	d.SingularTable(true)
	log.Println("数据库链接")
	db = d
}
