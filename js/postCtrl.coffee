###
post.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
POST_TYPE =
  question: '问题'
  bug: '错误'
  feature: '功能建议'
POST_STATUS = [
  {id:0 , title:'新建'}
  {id:1 , title:'受理'}
  {id:2 , title:'拒绝'}
  {id:3 , title:'解决'}
]
  
PostCtrl = ($scope, $modalInstance, $http, $log, ngTableParams, $filter, $q, type)->
  ### 反馈控制 ###
  $scope.new = true
  $scope.name = POST_TYPE[type]
  $scope.selectStatus = ->
    # 布尔列表
    def = $q.defer()
    ret = POST_STATUS
    def.resolve(ret)
    def
  $scope.status = (id)->
    for p in POST_STATUS
      if p.id == id
        return p.title
    '未知'
  $log.debug 'xxx %s', $scope.name
  $scope.$watch('p.type', (n, o)->
    #$scope.new = true
    $scope.name = POST_TYPE[n]
    $scope.tableParams.filter(
      type: n
    )
  )
  $scope.p =
    title: ''
    content: ''
    type: type
  $scope.ok = ->
    $http.post('/post', $scope.p).success((data)->
      if data.ok
        $log.debug data
        $modalInstance.dismiss('cancel')
      else
        alert(data.err)
    )
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      read: 'asc'
      ca: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post('/postq',
        Page: params.page()
        Count: params.count()
        Sorting: params.orderBy()
        Filter: params.filter()
      ).success((data)->
        $log.debug data
        params.total(data.count)
        $defer.resolve(data.data)
      )
  )
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')
  $scope.read = (d)->
    # 读取
    if !d.read
      $http.get("/post/#{d.id}").success((data)->
        $log.debug data
        if data.ok
          d.read=true
        else
          alert(data.err)
      )
    d.$edit=!d.$edit

PostCtrl.$inject = [
  '$scope'
  '$modalInstance'
  '$http'
  '$log'
  'ngTableParams'
  '$filter'
  '$q'
  'type'
]
