###
genealogyCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
GenealogyCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 族谱 ###
  $scope.t = {}
  $scope.nodes = {}
  $scope.add = (id, type)->
    ### 增加 ###
    $http.put("/node/#{id}/#{type}").success((data)->
      $log.debug 'put node'
      $log.debug data
      if data.ok
        # TODO 增加道 t 中
        $log.debug debug
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
        $log.debug $scope.nodes[node.Id]
        n = $scope.nodes[node.Id].node
        n.N = node.N
        n.G = node.G
        n.B = node.B
        n.L = node.L
        n.D = node.D
        n.T = node.T
        $scope.nodes[node.Id].label.destroy()
        x = $scope.nodes[node.Id].x
        y = $scope.nodes[node.Id].y
        $scope.addNode(n, x, y)
      )
    ,->
      $log.info '取消'
    )
  $http.get('/info/'+$scope.user.Id).success((data)->
    $log.debug 'get info'
    $scope.t = data.T
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

