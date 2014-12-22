package web

// 消息
type Msg struct {
	// 是否成功
	Ok bool `json:"ok"`
	// 错误信息
	Err string `json:"err,omitempty"`
	// 传输数据
	Data interface{} `json:"data,omitempty"`
	// 总数
	Count int `json:"count,omitempty"`
	// 验证码ID
	Cid string `json:"cid,omitempty"`
}
