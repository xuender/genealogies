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
