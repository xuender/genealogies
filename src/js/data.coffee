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
  '自身':
    f: '父亲'
    pf: '妻子'
    pt: '丈夫'
    ct: '儿子'
    cf: '女儿'
  '儿子':
    pf: '儿媳'
    ct: '孙子'
    cf: '孙女'
  '女儿':
    pt: '女婿'
    ct: '外孙子'
    cf: '外孙女'
  '父亲':
    f: '祖父'
    pf: '母亲'
    cta: '哥哥'
    cfa: '姐姐'
    ctb: '弟弟'
    cfb: '妹妹'
