###
genealogyCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
GenealogyCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 族谱 ###
  $scope.info = {}
  $scope.nodes = {}
  $scope.addNode = (node, x, y)->
    ### 增加节点 ###
    # 亡者增加黑色边框
    l = if node.L then 'white' else 'black'
    b = if node.L then "生辰: #{node.B.substr(0, 10)}" else "忌日: #{node.D.substr(0, 10)}"
    # 不同性别颜色不同
    g = if node.G then $scope.colors[0] else $scope.colors[8]
    label = $scope.ren.label("#{node.N}<br>#{b}", x, y)
      .attr(
        fill: g
        stroke: l
        'stroke-width': 2
        padding: 5
        r: 5
        'data-id': node.Id
      ).css(
        fontWeight: 'bold'
        color: 'white'
        cursor: 'pointer'
      ).on('click', (e)->
        # TODO 增加弹出窗口编辑信息、增加节点
        $log.debug this.getAttribute('data-id')
        $scope.edit $scope.nodes[this.getAttribute('data-id')].node
      ).add().shadow(true)
    $scope.nodes[node.Id]=
      node:node
      label:label
      x: x
      y: y
    #$scope.ren.path(['M', 120, 40, 'L', 120, 330])
    # .attr(
    #   'stroke-width': 2
    #   stroke: 'silver'
    #   dashstyle: 'dash'
    # ).add()
  $scope.show = (node=$scope.info, x=0, y=0) ->
    ### 显示族谱 ###
    $scope.addNode(node, x*250, y*80)
    if node.P
      $scope.addNode(node.P, (x*250) + 110, y*80)
    r = 0
    if node.C
      y++
      r = node.C.length
      for c in node.C
        $log.debug '%s -> %s:%d',node.N, c.N, x
        b = $scope.show(c, x, y)
        x = if b > 0 then x+b else x+1
    r

  $scope.add = (id, type)->
    ### 增加 ###
    $http.put("/node/#{id}/#{type}").success((data)->
      $log.debug 'put node'
      $log.debug data
      if data.ok
        $scope.addNode(data.node, 100, 200)
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
    $scope.info = data.T
    $log.debug data.T
    $scope.show()
  )
  $scope.chartConfig = {
    title:
      text: ""
    size:
      width: 2000
      height: 700
    loading: false
    func: (chart)->
      $log.debug 'chartConfig'
      #rightArrow = ['M', 0, 0, 'L', 100, 0, 'L', 95, 5, 'M', 100, 0, 'L', 95, -5]
      #leftArrow = ['M', 100, 0, 'L', 0, 0, 'L', 5, 5, 'M', 0, 0, 'L', 5, -5]
      $scope.ren = chart.renderer
    }
  $scope.colors = Highcharts.getOptions().colors
GenealogyCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

