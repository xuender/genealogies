###
treeCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
Node {
  N:  名称
  F:  父亲
  P:  伴侣们
  C:  子女
  G:  性别
  B:  生日
  L:  是否在世
  D:  祭日
  T:  电话
  E:  称谓
  x:  横轴
  y:  纵轴
  mx: 包括后代的最大横轴
  c:  是否收起
  cC: 收起后的子女
  cP: 收起后的伴侣们
}
###
TreeCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 用户 ###
  $log.debug '族谱'
  #$http.get('/clan/info').success((msg)->
  #  $log.debug 'get info'
  #  if msg.ok
  #    $scope.t = msg.data.t
  #  $log.debug angular.copy msg.data.t
  #)

TreeCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

