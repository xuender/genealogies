###
usersCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
UsersCtrl = ($scope, $http, $log, ngTableParams, $filter, $q)->
  ### 用户 ###
  $log.debug '用户'
  $scope.ims = ->
    def = $q.defer()
    ret = [
      {id:true, title:'是'}
      {id:false, title:'否'}
    ]
    def.resolve(ret)
    def
  $scope.$parent.name = 'users'
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      ca: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post('/users',
        Page: params.page()
        Count: params.count()
        Sorting: params.orderBy()
        Filter: params.filter()
      ).success((data)->
        params.total(data.count)
        $defer.resolve(data.data)
      )
  )

UsersCtrl.$inject = [
  '$scope'
  '$http'
  '$log'
  'ngTableParams'
  '$filter'
  '$q'
]

