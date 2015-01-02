###
postCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
PostsCtrl = ($scope, $http, $log, $modal, ngTableParams, $filter, $q)->
  ### 帖子 ###
  $log.debug '帖子'
  $scope.$parent.name = 'post'
  $scope.type = (id)->
    for k of POST_TYPE
      if k == id
        return POST_TYPE[k]
    '未知'
  $scope.status = (id)->
    for p in POST_STATUS
      if p.id == id
        return p.title
    '未知'
  $scope.selectType = ->
    # 布尔列表
    def = $q.defer()
    ret = []
    for k of POST_TYPE
      ret.push(
        id: k
        title: POST_TYPE[k]
      )
    def.resolve(ret)
    def
  $scope.selectStatus = ->
    # 布尔列表
    def = $q.defer()
    ret = []
    for i in POST_STATUS
      ret.push i
    def.resolve(ret)
    def
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      ca: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post('/cs/post',
        Page: params.page()
        Count: params.count()
        Sorting: params.orderBy()
        Filter: params.filter()
      ).success((data)->
        $log.debug data
        if data.ok
          params.total(data.count)
          $defer.resolve(data.data)
        else
          alert(data.err)
      )
  )
  $scope.ret = (s, d, rt=null)->
    # 回复
    if rt
      d.rt = rt
    d.status = s
    $http.put('/cs/post',d).success((data)->
      $log.debug data
      if data.ok
        d.$edit = false
        #alert('修改成功')
      else
        alert(data.err)
    )
  $scope.remove = (d)->
    # 删除
    $scope.confirm("是否删除 [ #{ d.title } ] ?", ->
      $http.delete("/cs/post/#{d.id}").success((data)->
        $log.debug data
        if data.ok
          $scope.tableParams.reload()
          alert('删除成功')
        else
          alert(data.err)
      )
    )
  $scope.log = (d)->
    $modal.open(
      templateUrl: 'partials/log.html?3.html'
      controller: LogCtrl
      backdrop: 'static'
      size: 'lg'
      resolve:
        oid: ->
          d.id
    )
PostsCtrl.$inject = [
  '$scope'
  '$http'
  '$log'
  '$modal'
  'ngTableParams'
  '$filter'
  '$q'
]

