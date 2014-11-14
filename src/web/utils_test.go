package web

import (
	"testing"
	//	log "github.com/Sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
)

func TestIdsDel(t *testing.T) {
	id := bson.NewObjectId()
	ids := []bson.ObjectId{bson.NewObjectId(), id, bson.NewObjectId()}
	nids := IdsDel(ids, id)
	if len(nids) != 2 {
		t.Errorf("删除数量错误中间")
	}
	ids = []bson.ObjectId{id, bson.NewObjectId(), bson.NewObjectId()}
	nids = IdsDel(ids, id)
	if len(nids) != 2 {
		t.Errorf("删除数量错误开始")
	}
	ids = []bson.ObjectId{bson.NewObjectId(), bson.NewObjectId(), id}
	nids = IdsDel(ids, id)
	if len(nids) != 2 {
		t.Errorf("删除数量错误结尾")
	}
}
