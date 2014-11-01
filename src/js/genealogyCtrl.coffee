###
genealogyCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
GenealogyCtrl = ($scope, $routeParams, $log, $http, $modal, lss)->
  ### 族谱 ###
  $scope.info = {}
  $scope.nodes = {}
  $scope.add= (node, x, y)->
    ### 增加节点 ###
    # 亡者增加黑色边框
    $scope.nodes[node.O] = node
    l = if node.L then 'white' else 'black'
    b = if node.L then "生辰: #{node.B.substr(5,5)}" else "忌日: #{node.D.substr(5,5)}"
    # 不同性别颜色不同
    g = if node.G then $scope.colors[0] else $scope.colors[8]
    $scope.ren.label("#{node.S}: #{node.N}<br>#{b}", x, y)
      .attr(
        fill: g
        stroke: l
        'stroke-width': 2
        padding: 5
        r: 5
        'data-id': node.O
      ).css(
        fontWeight: 'bold'
        color: 'white'
        cursor: 'pointer'
      ).on('click', (e)->
        # TODO 增加弹出窗口编辑信息、增加节点
        $log.debug this.getAttribute('data-id')
        $scope.edit $scope.nodes[this.getAttribute('data-id')]
      ).add().shadow(true)
    #$scope.ren.path(['M', 120, 40, 'L', 120, 330])
    # .attr(
    #   'stroke-width': 2
    #   stroke: 'silver'
    #   dashstyle: 'dash'
    # ).add()
  $scope.show = ->
    ### 显示族谱 ###
    $scope.add($scope.info, 20, 40)
    #$scope.add(
    #  Id: '123'
    #  N: '测试'
    #  L: true
    #  G: false
    #  B: '2011-01-01'
    #  S: '我'
    #  T: '110'
    #, 40, 80)
    #$scope.add(
    #  Id: '333'
    #  N: '爱新觉罗.溥仪'
    #  L: false
    #  D: '2011-01-01'
    #  G: true
    #  S: '皇帝'
    #  T: '119'
    #, 140, 180)
  $scope.edit = (node)->
    # 节点编辑
    i = $modal.open(
      templateUrl: '/partials/node.html'
      controller: 'NodeCtrl'
      backdrop: 'static'
      keyboard: true
      size: 'lg'
      resolve:
        node: ->
          angular.copy node
    )
    i.result.then((node)->
      $log.info '修改'
      $log.info node
      $http.post("/node/#{node.O}", node).success((data)->
        $log.debug data
      )
    ,->
      $log.info '取消'
    )
  $http.get('/info/'+$scope.user.Id).success((data)->
    $scope.info = data
    $log.debug data
    $scope.show()
  )
  $scope.chartConfig = {
    title:
      text: '族谱'
    size:
      width: 400
      height: 700
    loading: false
    func: (chart)->
      $scope.colors = Highcharts.getOptions().colors
      #rightArrow = ['M', 0, 0, 'L', 100, 0, 'L', 95, 5, 'M', 100, 0, 'L', 95, -5]
      #leftArrow = ['M', 100, 0, 'L', 0, 0, 'L', 5, 5, 'M', 0, 0, 'L', 5, -5]
      $scope.ren = chart.renderer
  }
GenealogyCtrl.$inject = [
  '$scope'
  '$routeParams'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

