package web

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

// 获取Json数据
func ReadJson(r *http.Request) map[string]string {
	var m map[string]string
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &m)
	return m
}
