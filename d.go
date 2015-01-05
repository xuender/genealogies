package main

import "./ds"

type Test struct {
}

func (t *Test) New(name string, ret *string) error {
	*ret = "你好" + name
	return nil
}
func main() {
	s := ds.New("testnrm", "test new R manager", 1234)
	s.Register(new(Test))
	s.Run()
}
