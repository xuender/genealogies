package main

import (
	"./base"
	"gopkg.in/mgo.v2/bson"
	"log"
)

func main() {
	base.LogDev()
	log.Println("启动")
	i := bson.NewObjectId()
	log.Println(i)
	i = *new(bson.ObjectId)
	log.Println(i)
	var a []bson.ObjectId

}
