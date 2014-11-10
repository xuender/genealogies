###
genealogyCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
GenealogyCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 族谱 ###
  $scope.nw = 120
  $scope.nh = 56
  $scope.t =
    x: 0
    y: 0
    P: [
      x:0
      y:0
    ]
  $scope.svgw = 1000
  $scope.svgh = 500
  $scope.sort = (t=$scope.t)->
    ### 排序 ###
    if t == $scope.t
      t.x = 0
      t.y = 0
    $scope.svgw = if t.x + 200 > $scope.svgw then t.x + 200 else $scope.svgw
    $scope.svgh = if t.y + 160 > $scope.svgh then t.y + 160 else $scope.svgh
    $log.debug '%d,%d', t.x, t.y
    t.mx = t.x

    if t.C
      $log.debug '排序 [ %s ] 的子女', t.N
      t.C.sort((a,b)->
        at = if a.G then new Date(a.B).getTime() - 162135596800000 else new Date(a.B).getTime()
        bt = if b.G then new Date(b.B).getTime() - 162135596800000 else new Date(b.B).getTime()
        at - bt
      )
      for c in t.C
        c.f = t
        c.x = t.mx
        c.y = t.y + $scope.nh + 50
        t.mx = if c.P then t.mx += ($scope.nw * 2) + 60 else t.mx += $scope.nw + 40
        $scope.sort(c)
        if c.mx > t.mx
          t.mx = c.mx
    if t.P
      x = t.x
      for p in t.P
        x += $scope.nw + 10
        p.x = x
        p.y = t.y
      w = (($scope.nw + 10) * (t.P.length + 1)) + 50
      if t.mx > t.x + w
        $log.debug 'pppp'
        t.x += (t.mx - t.x - w) / 2
      else
        t.mx = t.x + w
    else
      if t.mx > t.x + $scope.nw + 40
        $log.debug '!pppp'
        t.x += (t.mx - t.x - $scope.nw - 40) / 2
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
        $scope.update(t.P, n)
      if t.C
        for c in t.C
          $scope.update(c, n)
  $scope.addP = (t)->
    ### 增加伴侣 ###
    $log.debug 'addC'
    $http.put("/node/#{t.Id}/p").success((data)->
      if data.ok
        t.P = data.node
        $scope.sort()
        $scope.edit(data.node)
    )
  $scope.addC = (t)->
    ### 增加子女 ###
    $log.debug 'addC'
    $http.put("/node/#{t.Id}/c").success((data)->
      if data.ok
        if t.C
          t.C.push(data.node)
        else
          t.C = [data.node]
        $scope.sort()
        $scope.edit(data.node)
    )
  $scope.addF = (t)->
    ### 增加父亲 ###
    $log.debug 'addF'
    $http.put("/node/#{t.Id}/f").success((data)->
      if data.ok
        l = $scope.t
        $scope.t = data.node
        $scope.t.C = [l]
        $scope.sort()
        $scope.edit(data.node)
    )
  $scope.edit = (node)->
    # 节点编辑
    i = $modal.open(
      templateUrl: '/partials/node.html?v=2'
      controller: 'NodeCtrl'
      backdrop: 'static'
      keyboard: true
      size: 'lg'
      resolve:
        node: ->
          angular.copy node
        genealogy: ->
          $scope

    )
    i.result.then((node)->
      $log.debug '修改'
      $log.info node
      $http.post("/node/#{node.Id}", node).success((data)->
        $log.debug data
        if data.ok
          $scope.update($scope.t, node)
      )
    ,->
      $log.info '取消'
    )
  $http.get('/info/'+$scope.user.Id).success((data)->
    $log.debug 'get info'
    $scope.t = data.T
    $scope.sort()
    $scope.t.R = true
    $log.debug $scope.t
  )
GenealogyCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

