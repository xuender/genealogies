###
web.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
angular.module('web', [
  'ui.bootstrap'
  'hotkey'
  'LocalStorageModule'
])
PicsCtrl = ($scope, $log)->
  $scope.pics = [
    {
      src: "img/tree.png"
      h: "族谱"
      p: "树状族谱"
      d: "层层递进的树状族谱"
    }
    {
      src: "http://www.baidu.com/img/bd_logo1.png"
      h: "回忆录"
      p: "记录往昔岁月"
      d: "将人生经验教训传承下去"
    }
    {
      src: "http://www.baidu.com/img/bd_logo1.png"
      h: "成长日记"
      p: "子女人生进步的阶梯"
      d: "日日新"
    }
    {
      src: "http://www.baidu.com/img/bd_logo1.png"
      h: "族谱生成"
      p: "族谱可生成文档"
      d: "多种电子格式生成，可以打印、排版印刷或直接发送给亲人们"
    }
  ]
PicsCtrl.$inject = [
  '$scope'
  '$log'
]

