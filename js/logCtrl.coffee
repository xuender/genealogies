###
log.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
LogCtrl = ($scope, $modalInstance, $http, $log, ngTableParams, $filter, oid)->
  ### 日志控制 ###
  if oid
    $scope.url = "/cs/logs/#{ oid }"
  else
    $scope.url = "/logs"
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      ca: 'desc'
  ,
    getData: ($defer, params)->
      # 过滤
      $http.post($scope.url,
        Page: params.page()
        Count: params.count()
        Sorting: params.orderBy()
        Filter: params.filter()
      ).success((data)->
        params.total(data.count)
        $defer.resolve(data.data)
      )
  )
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

LogCtrl.$inject = [
  '$scope'
  '$modalInstance'
  '$http'
  '$log'
  'ngTableParams'
  '$filter'
  'oid'
]
