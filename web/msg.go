package web

// 消息
type Msg struct {
	Ok   bool        `json:"ok"`
	Err  string      `json:"err,omitempty"`
	Data interface{} `json:"data,omitempty"`
	Cid  string      `json:"cid,omitempty"`
}
