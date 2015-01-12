package main

import (
	"./dfr"
	"./ds"
)

func main() {
	s := ds.New("dfr", "Daemon of Free Radius", 1234)
	s.Register(new(dfr.Ctrl))
	s.Run()
}
