###
usersCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
UsersCtrl = ($scope, $http, $log, ngTableParams, $filter)->
  ### 用户 ###
  $log.debug '用户'
  $scope.$parent.name = 'users'
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      ca: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post('/cs/users',
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

