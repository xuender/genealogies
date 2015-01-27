###
ContactsCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
ContactsCtrl = ($scope, $log, ngTableParams, $filter, $q)->
  ### 用户 ###
  $log.debug '通讯簿'
  $scope.add = (n)->
    $log.debug 'add', n.N
    $scope.dt.push n
    if n.P
      for p in n.P
        $scope.dt.push p
    if n.C
      for c in n.C
        $scope.add c
  $scope.dt = []
  $scope.add $scope.t
  $scope.$watch('t', (n, o)->
    $scope.dt = []
    $log.debug 'watch', n.N
    $scope.add n
    $log.debug 'watch', $scope.dt.length
    $scope.tableParams.reload()
  , true)
  $scope.tableParams = new ngTableParams(
    page: 1
    count: 10
    sorting:
      G: 'desc'
      B: 'asc'
  ,
    getData: ($defer, params)->
      params.total($scope.dt.length)
      od = $scope.dt
      if params.filter()
        od = $filter('filter')($scope.dt, params.filter())
      if params.sorting()
        od = $filter('orderBy')(od, params.orderBy())
      $defer.resolve(
        od.slice(
          (params.page() - 1) * params.count(),
          params.page() * params.count()
        )
      )
  )

ContactsCtrl.$inject = [
  '$scope'
  '$log'
  'ngTableParams'
  '$filter'
  '$q'
]

