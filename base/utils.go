package base

import (
	"reflect"
)

// 删除Slice元素
func SliceRemove(slice, element interface{}) {
	sv := reflect.ValueOf(slice).Elem()
	for i := 0; i < sv.Len(); i++ {
		if reflect.DeepEqual(sv.Index(i).Interface(), element) {
			before := sv.Slice(0, i)
			after := sv.Slice(i+1, sv.Len())
			reflect.Copy(sv, reflect.AppendSlice(before, after))
			sv.SetLen(sv.Len() - 1)
			return
		}
	}
}
