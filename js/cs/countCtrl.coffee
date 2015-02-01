###
countCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
CountCtrl = ($scope, $route, $http, $log)->
  ### 统计 ###
  $log.debug '统计'
  $scope.$parent.name = 'count'
  $scope.chartConfig =
    chart:
      zoomType: 'xy'
    series:[
    ]
    xAxis:
      categories: []
    yAxis:[
      {
        title:
          text: '总数'
      }
      {
        title:
          text: '增加'
        opposite: true
      }
    ]
    title:
      text: '用户节点变化统计表'
    credits:
      enabled: true
    loading: false
    size:{}
  $http.get('/clan/count').success((msg)->
    $log.debug 'get count'
    if msg.ok
      $scope.chartConfig.xAxis.categories = []
      $scope.chartConfig.series = [
        {name:'注册用户', type: 'spline', data:[]}
        {name:'新增用户', type: 'column', data:[], yAxis: 1}
        {name:'创建节点', type: 'spline', data:[]}
        {name:'新增节点', type: 'column', data:[], yAxis: 1}
      ]
      for d in msg.data
        $scope.chartConfig.xAxis.categories.unshift(d.ca.substr(0,10))
        $scope.chartConfig.series[0].data.unshift(d.UserSum)
        $scope.chartConfig.series[1].data.unshift(d.UserAdd)
        $scope.chartConfig.series[2].data.unshift(d.NodeSum)
        $scope.chartConfig.series[3].data.unshift(d.NodeAdd)
  )

CountCtrl.$inject = [
  '$scope'
  '$route'
  '$http'
  '$log'
]

