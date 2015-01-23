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
  $scope.svgw = 1000
  $scope.svgh = 500
  $scope.t =
    Id: 'test'
    N: 'test'
    B: '2008-06-16'
    D: '3008-06-16'
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
      $http.put("/clan/node/#{n.Id}", n).success((msg)->
        $log.debug msg
        if msg.ok
          $scope.update($scope.t, n)
      )
    )
  $scope.addp = (t)->
    ### 增加伴侣 ###
    $log.debug 'addP'
    $scope.editor(
      N: if t.G then "#{t.N}的妻子" else "#{t.N}的丈夫"
      G: !t.G
      L: t.L
    , (n)->
      $log.debug 'addP ok'
      $http.post("/clan/node/#{t.Id}/p", n).success((msg)->
        $log.debug msg
        if msg.ok
          if t.P
            t.P.push(msg.data)
          else
            t.P =[msg.data]
      )
    )
  $scope.addf = (t)->
    ### 增加父亲 ###
    $log.debug 'addF'
    $scope.editor(
      N: "#{t.N}的父亲"
      G: true
      L: t.L
    , (n)->
      $log.debug 'addF ok'
      $log.debug n
      $http.post("/clan/node/#{t.Id}/f", n).success((msg)->
        if msg.ok
          l = $scope.t
          $scope.t = msg.data
          $scope.t.C = [l]
      )
    )
  $scope.addc = (node)->
    ### 增加子女 ###
    $log.debug 'addC'
    $scope.editor(
      N: "#{node.N}的儿子"
      G: true
      L: true
    , (n)->
      $log.debug 'addC ok'
      $log.debug n
      $http.post("/clan/node/#{node.Id}/c", n).success((msg)->
        if msg.ok
          if node.C
            node.C.push(msg.data)
          else
            node.C = [msg.data]
      )
    )
  $scope.toggle = (node)->
    # 收起展开
    if node.C
      node._C = node.C
      node.C = null
    else
      node.C = node._C
      node._C = null
  $http.get('/clan/info').success((msg)->
    $log.debug 'get info'
    if msg.ok
      $scope.t = msg.data.t
  )

TreeCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

