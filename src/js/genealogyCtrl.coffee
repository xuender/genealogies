###
genealogyCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
GenealogyCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 族谱 ###
  $scope.t = {}
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
    )
  $scope.addF = (t)->
    ### 增加父亲 ###
    $log.debug 'addF'
    $http.put("/node/#{t.Id}/f").success((data)->
      if data.ok
        l = $scope.t
        $scope.t = data.node
        $scope.t.C = [l]
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
    $scope.t.R = true
    $log.debug data.T
  )
GenealogyCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

