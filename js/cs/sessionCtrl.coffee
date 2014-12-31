###
sessionCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
SessionCtrl = ($scope, $http, $log, ngTableParams, $filter)->
  ### 会话 ###
  $log.debug '会话'
  $scope.remove = (d)->
    # 删除
    $scope.confirm('是否删除这条会话记录?', ->
      $http.delete("/cs/session/#{d.id}").success((data)->
        $log.debug data
        if data.ok
          $scope.tableParams.reload()
        else
          alert(data.err)
      )
    )
  $scope.$parent.name = 'session'
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      ua: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post('/cs/session',
        Page: params.page()
        Count: params.count()
        Sorting: params.orderBy()
        Filter: params.filter()
      ).success((data)->
        if data.ok
          params.total(data.count)
          $defer.resolve(data.data)
        else
          alert(data.err)
      )
  )

UsersCtrl.$inject = [
  '$scope'
  '$http'
  '$log'
  'ngTableParams'
  '$filter'
]

