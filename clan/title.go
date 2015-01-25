package clan

var titles map[string]Title

type Title struct {
	// 父亲
	F string
	// 妻子
	Pf string
	// 丈夫
	Pt string
	// 儿子
	Ct string
	// 女儿
	Cf string
	// 哥哥
	Cta string
	// 弟弟
	Ctb string
	//姐姐
	Cfa string
	// 妹妹
	Cfb string
	// 比较
	B string
}

// 初始化
func init() {
	titles = make(map[string]Title)
	//'高祖父':
	//  pf: '高祖母'
	titles["高祖父"] = Title{
		B:   "曾祖父",
		Pf:  "曾祖母",
		Cta: "伯曾祖父",
		Cfa: "姑曾祖母",
		Ctb: "叔曾祖父",
		Cfb: "姑曾祖母",
	}
	//'曾祖父':
	//  f: '高祖父'
	//  pf: '曾祖母'
	titles["曾祖父"] = Title{
		F:   "高祖父",
		B:   "祖父",
		Pf:  "曾祖母",
		Cta: "伯祖父",
		Cfa: "姑祖母",
		Ctb: "叔祖父",
		Cfb: "姑祖母",
	}
	//'祖父':
	//  f: '曾祖父'
	//  pf: '祖母'
	//  b:  '父亲'
	//  cta: '伯父'
	//  cfa: '姑姑'
	//  ctb: '叔父'
	//  cfb: '姑姑'
	titles["祖父"] = Title{
		F:   "曾祖父",
		B:   "父亲",
		Pf:  "祖母",
		Cta: "伯父",
		Cfa: "姑姑",
		Ctb: "叔父",
		Cfb: "姑姑",
	}
	//'伯父':
	//  b: '自身'
	//  pf: '伯母'
	//  cta: '堂兄'
	//  cfa: '堂姐'
	//  ctb: '堂弟'
	//  cfb: '堂妹'
	titles["伯父"] = Title{
		B:   ME,
		Pf:  "伯母",
		Cta: "堂兄",
		Cfa: "堂姐",
		Ctb: "堂弟",
		Cfb: "堂妹",
	}
	//'叔父':
	//  b: '自身'
	//  pf: '婶母'
	//  cta: '堂兄'
	//  cfa: '堂姐'
	//  ctb: '堂弟'
	//  cfb: '堂妹'
	titles["叔父"] = Title{
		B:   ME,
		Pf:  "婶母",
		Cta: "堂兄",
		Cfa: "堂姐",
		Ctb: "堂弟",
		Cfb: "堂妹",
	}
	//'侄子':
	//  pf: '侄媳'
	//  ct: '侄孙'
	//  cf: '侄孙女'
	titles["侄子"] = Title{
		Pf: "侄媳",
		Ct: "侄孙",
		Cf: "侄孙女",
	}
	//'侄女':
	//  pt: '侄女婿'
	//  ct: '侄孙'
	//  cf: '侄孙女'
	titles["侄女"] = Title{
		Pt: "侄女婿",
		Ct: "侄孙",
		Cf: "侄孙女",
	}
	//'父亲':
	//  f: '祖父'
	//  b: '本人',
	//  pf: '母亲'
	//  cta: '哥哥'
	//  cfa: '姐姐'
	//  ctb: '弟弟'
	//  cfb: '妹妹'
	titles["父亲"] = Title{
		F:   "祖父",
		B:   ME,
		Pf:  "母亲",
		Cta: "哥哥",
		Cfa: "姐姐",
		Ctb: "弟弟",
		Cfb: "妹妹",
	}
	//'自身':
	//  f: '父亲'
	//  pf: '妻子'
	//  pt: '丈夫'
	//  ct: '儿子'
	//  cf: '女儿'
	titles[ME] = Title{
		F:  "父亲",
		Pf: "妻子",
		Pt: "丈夫",
		Ct: "儿子",
		Cf: "女儿",
	}
	//'哥哥':
	//  pf: '嫂子'
	//  ct: '侄子'
	//  cf: '侄女'
	titles["哥哥"] = Title{
		Pf: "嫂子",
		Ct: "侄子",
		Cf: "侄女",
	}
	titles["堂兄"] = Title{
		Pf: "堂嫂",
		Ct: "侄子",
		Cf: "侄女",
	}
	titles["堂弟"] = Title{
		Pf: "堂弟媳",
		Ct: "侄子",
		Cf: "侄女",
	}
	//'姐姐':
	//  pt: '姐夫'
	//  ct: '外甥'
	//  cf: '外甥女'
	titles["姐姐"] = Title{
		Pt: "姐夫",
		Ct: "外甥",
		Cf: "外甥女",
	}
	titles["堂姐"] = Title{
		Pt: "堂姐夫",
		Ct: "外甥",
		Cf: "外甥女",
	}
	titles["堂妹"] = Title{
		Pt: "堂妹夫",
		Ct: "外甥",
		Cf: "外甥女",
	}
	//'弟弟':
	//  pf: '弟媳'
	//  ct: '侄子'
	//  cf: '侄女'
	titles["弟弟"] = Title{
		Pf: "弟媳",
		Ct: "侄子",
		Cf: "侄女",
	}
	//'妹妹':
	//  pt: '妹夫'
	//  ct: '外甥'
	//  cf: '外甥女'
	titles["妹妹"] = Title{
		Pt: "妹夫",
		Ct: "外甥",
		Cf: "外甥女",
	}
	//'儿子':
	//  pf: '儿媳'
	//  ct: '孙子'
	//  cf: '孙女'
	titles["儿子"] = Title{
		Pf: "儿媳",
		Ct: "孙子",
		Cf: "孙女",
	}
	//'女儿':
	//  pt: '女婿'
	//  ct: '外孙子'
	//  cf: '外孙女'
	titles["女儿"] = Title{
		Pt: "女婿",
		Ct: "外孙子",
		Cf: "外孙女",
	}
	//'孙子':
	//  pf: '孙媳'
	//  ct: '曾孙'
	//  cf: '曾孙女'
	titles["孙子"] = Title{
		Pf: "孙媳",
		Ct: "曾孙",
		Cf: "曾孙女",
	}
	//'孙女':
	//  pt: '孙女婿'
	//  ct: '曾外孙'
	//  cf: '曾外孙女'
	titles["孙女"] = Title{
		Pt: "孙女婿",
		Ct: "曾外孙",
		Cf: "曾外孙女",
	}
	//'曾孙':
	//  pf: '曾孙媳'
	//  ct: '玄孙'
	//  cf: '玄孙女'
	titles["曾孙"] = Title{
		Pf: "曾孙媳",
		Ct: "玄孙",
		Cf: "玄孙女",
	}
	//'玄孙':
	//  pf: '玄孙媳'
	titles["玄孙"] = Title{
		Pf: "玄孙媳",
		Ct: "曾玄孙",
		Cf: "曾玄孙女",
	}
}
