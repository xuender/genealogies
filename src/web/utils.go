package web

import (
	"encoding/json"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"net/http"
	//	log "github.com/Sirupsen/logrus"
)

// 获取Json数据
func ReadJson(r *http.Request) map[string]string {
	var m map[string]string
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &m)
	return m
}

// 删除某ID
func IdsDel(ids []bson.ObjectId, id bson.ObjectId) []bson.ObjectId {
	for i, t := range ids {
		if t == id {
			return append(ids[:i], ids[i+1:]...)
		}
	}
	return ids
}
