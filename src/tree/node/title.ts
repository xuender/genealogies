export interface Children {
	title?: string;
	older?: string;
	young?: string;
	compare?: string;
}

export interface Title {
	title: string;
	father?: string;
	mother?: string;
	husband?: string;
	wife?: string;
	exHusband?: string;
	exWife?: string;
	son?: Children;
	daughter?: Children;
}

export const TITLE_DEFAULT: Title[] = [
	{title: '本人', father: '父亲', mother: '母亲', husband: '丈夫', wife: '妻子', exHusband: '前夫', exWife: '前妻',
		son: {title: '儿子'}, daughter: {title: '女儿'}
	},
	{title: '父亲', father: '祖父', mother: '祖母', wife: '母亲', exWife: '阿姨',
		son: {older: '哥哥', young: '弟弟', compare: '本人'}, daughter: {older: '姐姐', young: '妹妹', compare: '本人'}
	},
	{title: '祖父', father: '曾祖父', mother: '曾祖母', wife: '祖母', exWife: '阿婆',
		son: {older: '伯父', young: '叔父', compare: '父亲'}, daughter: {title: '姑母'}
	},
	{title: '曾祖父', father: '高祖父', mother: '高祖母', wife: '曾祖母', exWife: '曾祖婆',
		son: {older: '伯祖父', young: '叔祖父', compare: '祖父'}, daughter: {title: '祖姑'}
	},
	{title: '高祖父', wife: '高祖母', exWife: '高祖婆',
		son: {older: '曾伯祖父', young: '曾叔祖父', compare: '曾祖父'}, daughter: {title: '曾祖姑'}
	},
	{title: '母亲', father: '外公', mother: '外婆', husband: '父亲', exHusband: '叔叔',
		son: {older: '哥哥', young: '弟弟', compare: '本人'}, daughter: {older: '姐姐', young: '妹妹', compare: '本人'}
	},
	{title: '儿子', father: '丈夫', mother: '妻子', wife: '儿媳',
		son: {title: '孙子'}, daughter: {title: '孙女'}
	},
	{title: '孙子', father: '儿子', mother: '儿媳', wife: '孙媳',
		son: {title: '曾孙'}, daughter: {title: '曾孙女'}
	},
	{title: '孙女', father: '儿子', mother: '儿媳', husband: '孙女婿',
		son: {title: '曾外孙'}, daughter: {title: '曾外孙女'}
	},
	{title: '曾孙', father: '孙子', mother: '孙媳', wife: '曾孙媳',
		son: {title: '玄孙'}, daughter: {title: '玄孙女'}
	},
	{title: '曾孙女', father: '孙子', mother: '孙媳', husband: '曾孙女婿',
		son: {title: '玄外孙'}, daughter: {title: '玄外孙女'}
	},
	{title: '女儿', father: '丈夫', mother: '妻子', husband: '女婿',
		son: {title: '外孙'}, daughter: {title: '外孙女'}
	},
	{title: '外孙', father: '女婿', mother: '女儿', wife: '外孙媳',
		son: {title: '曾外孙'}, daughter: {title: '曾外孙女'}
	},
	{title: '外孙女', father: '女婿', mother: '女儿', husband: '外孙女婿',
		son: {title: '曾外孙'}, daughter: {title: '曾外孙女'}
	},
	{title: '曾外孙', father: '外孙子', mother: '外孙媳', wife: '曾外孙媳',
		son: {title: '玄外孙'}, daughter: {title: '玄外孙女'}
	},
	{title: '曾外孙女', father: '外孙子', mother: '外孙媳', husband: '曾外孙女婿',
		son: {title: '玄外孙'}, daughter: {title: '玄外孙女'}
	},
	{title: '哥哥', father: '父亲', mother: '母亲', wife: '嫂子',
		son: {title: '侄子'}, daughter: {title: '侄女'}
	},
	{title: '弟弟', father: '父亲', mother: '母亲', wife: '弟妹',
		son: {title: '侄子'}, daughter: {title: '侄女'}
	},
	{title: '侄子', wife: '侄媳',
		son: {title: '侄孙'}, daughter: {title: '侄孙女'}
	},
	{title: '侄女', husband: '侄女婿',
		son: {title: '侄外孙'}, daughter: {title: '侄外孙女'}
	},
	{title: '姐姐', father: '父亲', mother: '母亲', husband: '姐夫',
		son: {title: '外甥'}, daughter: {title: '外甥女'}
	},
	{title: '妹妹', father: '父亲', mother: '母亲', husband: '妹夫',
		son: {title: '外甥'}, daughter: {title: '外甥女'}
	},
	{title: '外甥', wife: '外甥媳',
		son: {title: '外孙'}, daughter: {title: '外孙女'}
	},
	{title: '外甥女', husband: '外甥女婿',
		son: {title: '外孙'}, daughter: {title: '外孙女'}
	},
	{title: '伯父', father: '祖父', mother: '祖母', wife: '伯母',
		son: {older: '堂兄', young: '堂弟', compare: '本人'}, daughter: {older: '堂姐', young: '堂妹', compare: '本人'}
	},
	{title: '叔父', father: '祖父', mother: '祖母', wife: '婶娘',
		son: {older: '堂兄', young: '堂弟', compare: '本人'}, daughter: {older: '堂姐', young: '堂妹', compare: '本人'}
	},
	{title: '姑母', father: '祖父', mother: '祖母', husband: '姑父',
		son: {older: '表兄', young: '表弟', compare: '本人'}, daughter: {older: '表姐', young: '表妹', compare: '本人'}
	},
	{title: '堂兄', wife: '堂嫂',
		son: {title: '堂侄'}, daughter: {title: '堂侄女'}
	},
	{title: '堂弟', wife: '堂弟媳',
		son: {title: '堂侄'}, daughter: {title: '堂侄女'}
	},
	{title: '堂姐', husband: '堂姐夫',
		son: {title: '堂外甥'}, daughter: {title: '堂外甥女'}
	},
	{title: '堂妹', husband: '堂妹夫',
		son: {title: '堂外甥'}, daughter: {title: '堂外甥女'}
	},
	{title: '伯祖父', father: '曾祖父', mother: '曾祖母', wife: '伯祖母',
		son: {older: '堂伯父', young: '堂叔父', compare: '父亲'}, daughter: {title: '堂姑母'}
	},
	{title: '叔祖父', father: '曾祖父', mother: '曾祖母', wife: '叔祖母',
		son: {older: '堂伯父', young: '堂叔父', compare: '父亲'}, daughter: {title: '堂姑母'}
	},
	{title: '堂伯父', wife: '堂伯母',
		son: {older: '再从兄', young: '再从弟', compare: '本人'}, daughter: {older: '再从姐', young: '再从妹', compare: '本人'}
	},
	{title: '堂叔父', wife: '堂叔母',
		son: {older: '再从兄', young: '再从弟', compare: '本人'}, daughter: {older: '再从姐', young: '再从妹', compare: '本人'}
	},
	{title: '再从兄', wife: '再从嫂',
		son: {title: '再从侄'}, daughter: {title: '再从侄女'}
	},
	{title: '再从弟', wife: '再从弟媳',
		son: {title: '再从侄'}, daughter: {title: '再从侄女'}
	},
	{title: '再从姐', husband: '再从姐夫',
		son: {title: '再从外甥'}, daughter: {title: '再从外甥女'}
	},
	{title: '再从妹', husband: '再从妹夫',
		son: {title: '再从外甥'}, daughter: {title: '再从外甥女'}
	},
	{title: '曾伯祖父', father: '高祖父', mother: '高祖母', wife: '曾伯祖母',
		son: {older: '族伯祖父', young: '族叔祖父', compare: '祖父'}, daughter: {title: '族祖姑'}
	},
	{title: '曾叔祖父', father: '高祖父', mother: '高祖母', wife: '曾叔祖母',
		son: {older: '族伯祖父', young: '族叔祖父', compare: '祖父'}, daughter: {title: '族祖姑'}
	},
	{title: '族伯祖父', wife: '族伯祖母',
		son: {older: '族伯父', young: '族叔父', compare: '父亲'}, daughter: {title: '族姑母'}
	},
	{title: '族叔祖父', wife: '族叔祖母',
		son: {older: '族伯父', young: '族叔父', compare: '父亲'}, daughter: {title: '族姑母'}
	},
	{title: '族伯父', wife: '族伯母',
		son: {older: '族兄', young: '族弟', compare: '本人'}, daughter: {older: '族姐', young: '族妹', compare: '本人'}
	},
	{title: '族叔父', wife: '族婶娘',
		son: {older: '族兄', young: '族弟', compare: '本人'}, daughter: {older: '族姐', young: '族妹', compare: '本人'}
	},
];
