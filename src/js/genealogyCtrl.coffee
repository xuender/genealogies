###
genealogyCtrl.coffee
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
  x:  横轴
  y:  纵轴
  mx: 包括后代的最大横轴
  c:  是否收起
  cC: 收起后的子女
  cP: 收起后的伴侣们
}
###
GenealogyCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 族谱 ###
  lss.bind($scope, "cids", [])
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
  $scope.reset = (t=$scope.t)->
    # 重置展开关闭
    if t.c and t.C
      t.cC = t.C
      delete t.C
    if !t.c and t.cC
      t.C = t.cC
      delete t.cC
    if t.c and t.P
      t.cP = t.P
      delete t.P
    if !t.c and t.cP
      t.P = t.cP
      delete t.cP
    if t.C
      for c in t.C
        $scope.reset(c)
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
      w = (($scope.nw + 10) * (t.P.length + 1)) + 50
      if t.mx > t.x + w
        $log.debug 'pppp'
        t.x += (t.mx - t.x - w) / 2
      else
        t.mx = t.x + w
      x = t.x
      for p in t.P
        x += $scope.nw + 10
        p.x = x
        p.y = t.y
    else
      if t.mx > t.x + $scope.nw + 40
        $log.debug '!pppp'
        t.x += (t.mx - t.x - $scope.nw - 40) / 2
  $scope.delete = (n, t=$scope.t)->
    ### 删除 ###
    if t.P
      if t.P.indexOf(n) >= 0
        t.P.splice(t.P.indexOf(n), 1)
        return
    if t.C
      if t.C.indexOf(n) >= 0
        t.C.splice(t.C.indexOf(n), 1)
      else
        for c in t.C
          $scope.delete(n, c)

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
  $scope.addP = (t)->
    ### 增加伴侣 ###
    $log.debug 'addP'
    $scope.editor(
      N: if t.G then "#{t.N}的妻子" else "#{t.N}的丈夫"
      G: !t.G
      L: t.L
    , (n)->
      $log.debug 'addP ok'
      $log.debug n
      $http.put("/node/#{t.Id}/p", n).success((data)->
        if data.ok
          if t.P
            t.P.push(data.node)
          else
            t.P =[data.node]
          $scope.sort()
      )
    )
  $scope.editor= (n, func)->
    # 编辑用户信息
    i = $modal.open(
      templateUrl: '/partials/node.html?v=2'
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
      $log.debug '增加'
      $log.info node
      func(node)
    ,->
      $log.info '取消'
    )
  $scope.addC = (t)->
    ### 增加子女 ###
    $log.debug 'addC'
    $scope.editor(
      N: "#{t.N}的儿子"
      G: true
      L: true
    , (n)->
      $log.debug 'addC ok'
      $log.debug n
      $http.put("/node/#{t.Id}/c", n).success((data)->
        if data.ok
          if t.C
            t.C.push(data.node)
          else
            t.C = [data.node]
          $scope.sort()
      )
    )
  $scope.addF = (t)->
    ### 增加父亲 ###
    $log.debug 'addF'
    $scope.editor(
      N: "#{t.N}的父亲"
      G: true
      L: t.L
    , (n)->
      $log.debug 'addF ok'
      $log.debug n
      $http.put("/node/#{t.Id}/f", n).success((data)->
        if data.ok
          l = $scope.t
          $scope.t = data.node
          $scope.t.C = [l]
          $scope.sort()
      )
    )
  $scope.close = (n, c=true)->
    # 收起
    if c
      $scope.cids.push(n.Id)
    else
      $scope.cids.splice($scope.cids.indexOf(n.Id), 1)
    $log.debug $scope.t
    $log.debug c
    n.c = c
    $scope.reset()
    $scope.sort()
  $scope.edit = (node)->
    # 节点编辑
    $scope.editor(angular.copy(node), (n)->
      $log.debug '修改'
      $log.info n
      $http.post("/node/#{n.Id}", n).success((data)->
        $log.debug data
        if data.ok
          $scope.update($scope.t, n)
      )
    )
  $scope.del = (n)->
    # 节点删除
    $scope.confirm("是否删除 [ #{n.N} ] ?",->
      $http.delete("/node/#{n.Id}").success((data)->
        $log.debug data
        if data.ok
          $scope.delete(n)
          $scope.sort()
        else
          $scope.alert data.error
      )
    )
  $scope.delP = (n, p)->
    # 节点删除
    $scope.confirm("是否删除 [ #{n.N} ] 的伴侣 [ #{p.N} ] ?",->
      $http.delete("/node/#{n.Id}/#{p.Id}").success((data)->
        $log.debug data
        if data.ok
          $scope.delete(p)
          $scope.sort()
        else
          $scope.alert data.error
      )
    )
  $http.get('/info/'+$scope.user.Id).success((data)->
    $log.debug 'get info'
    $scope.t = data.T
    $scope.readCids()
    $scope.reset()
    $scope.sort()
    $scope.t.R = true
    $log.debug $scope.t
  )
  $scope.readCids = (t=$scope.t)->
    # 读取收起标记
    t.c = $scope.cids.indexOf(t.Id) >= 0
    if t.C
      for i in t.C
        $scope.readCids(i)
GenealogyCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

