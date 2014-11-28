###
data.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

# 称谓
# f   父亲
# pt  男性的伴侣
# pf  女性的伴侣
# ct  男性孩子
# cf  女性孩子
# cta 比较大的男性孩子
# cfa 比较大的女性孩子
# ctb 比较小的男性孩子
# cfb 比较小的女性孩子
TITLE =
  '高祖父':
    pf: '高祖母'
  '曾祖父':
    f: '高祖父'
    pf: '曾祖母'
  '祖父':
    f: '曾祖父'
    pf: '祖母'
    b:  '父亲'
    cta: '伯父'
    cfa: '姑姑'
    ctb: '叔父'
    cfb: '姑姑'
  '伯父':
    b: '自身'
    pf: '伯母'
    cta: '堂兄'
    cfa: '堂姐'
    ctb: '堂弟'
    cfb: '堂妹'
  '叔父':
    b: '自身'
    pf: '婶母'
    cta: '堂兄'
    cfa: '堂姐'
    ctb: '堂弟'
    cfb: '堂妹'
  '父亲':
    f: '祖父'
    pf: '母亲'
    b:  '自身'
    cta: '哥哥'
    cfa: '姐姐'
    ctb: '弟弟'
    cfb: '妹妹'
  '哥哥':
    pf: '嫂子'
    ct: '侄子'
    cf: '侄女'
  '侄子':
    pf: '侄媳'
    ct: '侄孙'
    cf: '侄孙女'
  '侄女':
    pt: '侄女婿'
    ct: '侄孙'
    cf: '侄孙女'
  '姐姐':
    pt: '姐夫'
    ct: '外甥'
    cf: '外甥女'
  '自身':
    f: '父亲'
    pf: '妻子'
    pt: '丈夫'
    ct: '儿子'
    cf: '女儿'
  '妹妹':
    pt: '妹夫'
    ct: '外甥'
    cf: '外甥女'
  '弟弟':
    pf: '弟媳'
    ct: '侄子'
    cf: '侄女'
  '儿子':
    pf: '儿媳'
    ct: '孙子'
    cf: '孙女'
  '女儿':
    pt: '女婿'
    ct: '外孙子'
    cf: '外孙女'
  '孙子':
    pf: '孙媳'
    ct: '曾孙'
    cf: '曾孙女'
  '孙女':
    pt: '孙女婿'
    ct: '曾外孙'
    cf: '曾外孙女'
  '曾孙':
    pf: '曾孙媳'
    ct: '玄孙'
    cf: '玄孙女'
  '玄孙':
    pf: '玄孙媳'
