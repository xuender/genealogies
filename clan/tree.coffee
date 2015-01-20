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
  $scope.t =
    N: 'test'
  $scope.editor= (n, func)->
    # 编辑用户信息
    i = $modal.open(
      templateUrl: '/partials/clan/node.html?v=2'
      controller: 'NodeCtrl'
      backdrop: 'static'
      keyboard: true
      size: 'lg'
      resolve:
        node: ->
          n
        genealogy: ->
          $scope
    )
    i.result.then((node)->
      $log.debug '编辑完毕'
      $log.info node
      func(node)
    ,->
      $log.info '取消'
    )
  $scope.update = (t, n)->
    ### 修改 ###
    if t.Id == n.Id
      t.N = n.N
      t.G = n.G
      t.B = n.B
      t.L = n.L
      t.D = n.D
      t.T = n.T
    else
      if t.P
        for p in t.P
          $scope.update(p, n)
      if t.C
        for c in t.C
          $scope.update(c, n)
  $scope.edit = (node)->
    # 编辑节点
    $scope.editor(angular.copy(node), (n)->
      $log.debug '修改'
      $log.info n
      #$http.post("/node/#{n.Id}", n).success((data)->
      #  $log.debug data
      #  if data.ok
      $scope.update($scope.t, n)
      #)
    )
  $http.get('/clan/info').success((msg)->
    $log.debug 'get info'
    if msg.ok
      $scope.t = msg.data.t
    $log.debug angular.copy msg.data.t
  )

TreeCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

