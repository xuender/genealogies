package fr

// nas
type Nas struct {
	Id          int64
	Nasname     string `sql:"size:128"`
	Shortname   string `sql:"size:32"`
	Type        string `sql:"size:30"`
	Ports       int
	Secret      string `sql:"size:60"`
	Server      string `sql:"size:64"`
	Community   string `sql:"size:50"`
	Description string `sql:"size:200"`
}
