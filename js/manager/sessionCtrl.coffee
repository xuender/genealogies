###
sessionCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
SessionCtrl = ($scope, $http, $log, ngTableParams, $filter, $q)->
  ### 会话 ###
  $log.debug '会话'
  $scope.ims = ->
    def = $q.defer()
    ret = [
      {id:true, title:'是'}
      {id:false, title:'否'}
    ]
    def.resolve(ret)
    def
  $scope.$parent.name = 'session'
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      ua: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post('/session',
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

UsersCtrl.$inject = [
  '$scope'
  '$http'
  '$log'
  'ngTableParams'
  '$filter'
  '$q'
]

