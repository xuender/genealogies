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
  $scope.svgw = 600
  $scope.svgh = 400
  $scope.showThree = true
  $scope.$watch('svgw', (n, o)->
    $log.debug 'w', n
  )
  $scope.t =
    Id: 'test'
    G:  true
    N: 'test'
    B: '2008-06-16'
    D: '3008-06-16'
  $scope.editor= (n, func, title='编辑')->
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
        title: ->
          title
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
      n.E = t.E
      $http.post("/clan/node/#{t.Id}/p", n).success((msg)->
        $log.debug msg
        if msg.ok
          if t.P
            t.P.push(msg.data)
          else
            t.P =[msg.data]
      )
    , '增加伴侣'
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
      n.E = t.E
      $http.post("/clan/node/#{t.Id}/f", n).success((msg)->
        if msg.ok
          l = $scope.t
          $scope.t = msg.data
          $scope.t.C = [l]
      )
    , '增加父亲'
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
      n.E = node.E
      $http.post("/clan/node/#{node.Id}/c", n).success((msg)->
        if msg.ok
          if node.C
            node.C.push(msg.data)
          else
            node.C = [msg.data]
      )
    , '增加子女'
    )
  $scope.delete = (n, t=$scope.t)->
    # 删除
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
  $scope.remove = (node)->
    # 删除
    $scope.confirm("是否删除 #{node.N}？", ->
      $log.debug "删除 #{node.N}"
      $http.delete("/clan/node/#{node.Id}").success((msg)->
        $log.debug msg
        if msg.ok
          $scope.delete(node)
        else
          $scope.alert msg.err
      )
    )
  $scope.children= (t, p)->
    # 选择子女
    i = $modal.open(
      templateUrl: '/partials/clan/children.html?v=1'
      controller: 'ChildrenCtrl'
      backdrop: 'static'
      keyboard: true
      size: 'sm'
      resolve:
        p: ->
          p.N
        t: ->
          t.N
        c: ->
          if t.C
            ret = angular.copy t.C
          else if t._C
            ret = angular.copy t._C
          if p.C
            for c in p.C
              for r in ret
                if c.Id == r.Id
                  r.s = true
          $log.debug ret
          ret

    )
    i.result.then((ids)->
      $log.debug '修改子女', ids
      $http.put("/clan/children/#{p.Id}", ids).success((msg)->
        $log.debug msg
        if msg.ok
          p.C = []
          for c in msg.data
            if t.C
              for tc in t.C
                if tc.Id == c.Id
                  p.C.push tc
      )
    ,->
      $log.info '取消'
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

