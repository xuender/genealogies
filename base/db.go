package base

import (
	"errors"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"reflect"
	"time"
)

//const (
//  MGO = iota
//)
var dbSession *mgo.Session
var dbDB *mgo.Database

// 打开数据库
func DbOpen(ip, name string) (err error) {
	dbSession, err = mgo.Dial(ip)
	if err != nil {
		log.Fatal("数据库连接失败")
		panic("数据库连接失败")
	}
	dbSession.SetMode(mgo.Monotonic, true)
	dbDB = dbSession.DB(name)
	return
}

// 数据库清空
func DbClean() {
	dbDB.DropDatabase()
}

// 测试数据库
func DbTest() (err error) {
	dbSession, err = mgo.Dial("127.0.0.1")
	if err != nil {
		log.Fatal("数据库连接失败")
		panic("数据库连接失败")
	}
	dbSession.SetMode(mgo.Monotonic, true)
	dbDB = dbSession.DB("test")
	dbDB.DropDatabase()
	return
}

// 关闭数据库
func DbClose() {
	dbSession.Close()
}

// 数据库对象
type Obj struct {
	// 数据库名称
	Name string
	// 包含创建时间
	Ca bool
	// 包含修改时间
	Ua bool
	// 包含删除时间
	Ra bool
}

// 保存
func (o *Obj) Save(i interface{}) error {
	m := reflect.ValueOf(i).Elem()
	v := reflect.ValueOf(m.Interface())
	id := v.FieldByName("Id").Interface().(bson.ObjectId)
	n := false
	if !id.Valid() {
		n = true
		m.FieldByName("Id").Set(reflect.ValueOf(bson.NewObjectId()))
	}
	if o.Ca {
		ca := v.FieldByName("Ca").Interface().(time.Time)
		if ca.IsZero() {
			m.FieldByName("Ca").Set(reflect.ValueOf(time.Now()))
			n = true
		}
	}
	if o.Ua {
		m.FieldByName("Ua").Set(reflect.ValueOf(time.Now()))
	}
	c := dbDB.C(o.Name)
	if n {
		return c.Insert(i)
	}
	return c.UpdateId(id, i)
}

// 查找
func (o *Obj) Find(i interface{}) error {
	m := reflect.ValueOf(i).Elem()
	v := reflect.ValueOf(m.Interface())
	id := v.FieldByName("Id").Interface().(bson.ObjectId)
	if id.Valid() {
		return dbDB.C(o.Name).FindId(id).One(i)
	}
	return errors.New("Id无效，无法查找")
}

// Map查找
func (o *Obj) FindM(i interface{}, m bson.M, fields ...string) error {
	if len(fields) == 0 {
		return dbDB.C(o.Name).Find(m).One(i)
	}
	return dbDB.C(o.Name).Find(m).Sort(fields...).One(i)
}

// count
func (o *Obj) Count(i interface{}, m bson.M) int {
	ret, err := dbDB.C(o.Name).Find(m).Count()
	if err == nil {
		return ret
	}
	return 0
}

// 查找
func (o *Obj) Query(list interface{}, m bson.M, fields ...string) error {
	if len(fields) == 0 {
		return dbDB.C(o.Name).Find(m).All(list)
	}
	return dbDB.C(o.Name).Find(m).Sort(fields...).All(list)
}

// 删除
func (o *Obj) Remove(i interface{}) error {
	m := reflect.ValueOf(i).Elem()
	v := reflect.ValueOf(m.Interface())
	id := v.FieldByName("Id").Interface().(bson.ObjectId)
	if id.Valid() {
		c := dbDB.C(o.Name)
		if o.Ra {
			m.FieldByName("Ra").Set(reflect.ValueOf(time.Now()))
			return c.UpdateId(id, i)
		} else {
			return c.RemoveId(id)
		}
	}
	return errors.New("Id无效，无法删除")
}

var objMap map[reflect.Type]Obj

func findObj(i interface{}) (obj Obj, err error) {
	it := reflect.TypeOf(reflect.ValueOf(i).Elem().Interface())
	ok := false
	obj, ok = objMap[it]
	if !ok {
		field, hid := it.FieldByName("Id")
		if !hid {
			err = errors.New("对象缺少属性Id")
			return
		}
		_, ca := it.FieldByName("Ca")
		_, ua := it.FieldByName("Ua")
		_, ra := it.FieldByName("Ra")
		obj = Obj{
			Name: field.Tag.Get("table"),
			Ca:   ca,
			Ua:   ua,
			Ra:   ra,
		}
		objMap[it] = obj
	}
	return
}

// 保存对象
func Save(i interface{}) error {
	obj, err := findObj(i)
	if err == nil {
		err = obj.Save(i)
	}
	return err
}

// 查找对象
func Find(i interface{}) error {
	obj, err := findObj(i)
	if err == nil {
		err = obj.Find(i)
	}
	return err
}

// 查找对象M
func FindM(i interface{}, m bson.M, fields ...string) error {
	obj, err := findObj(i)
	if err == nil {
		err = obj.FindM(i, m, fields...)
	}
	return err
}

// 统计
func Count(i interface{}, m bson.M) int {
	obj, err := findObj(i)
	if err == nil {
		return obj.Count(i, m)
	}
	return 0
}

// 查询
func Query(i interface{}, r interface{}, m bson.M, fields ...string) error {
	obj, err := findObj(i)
	if err == nil {
		err = obj.Query(r, m, fields...)
	}
	return err
}

// 删除对象
func Remove(i interface{}) error {
	obj, err := findObj(i)
	if err == nil {
		err = obj.Remove(i)
	}
	return err
}

// 初始化
func init() {
	objMap = make(map[reflect.Type]Obj)
}
