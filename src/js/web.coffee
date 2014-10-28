###
web.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
angular.module('web', [
  'ui.bootstrap'
  'hotkey'
  'LocalStorageModule'
])

WebCtrl = ($scope, $log, $http, $modal, lss)->
  ### 网页制器 ###
  $scope.isLogin = false
  lss.bind($scope, "id", '')
  if $scope.id
    $http.get('/session/'+$scope.id).success((data)->
      $log.debug(data)
      $scope.isLogin = data.ok
      if data.ok
        $scope.user = data.user
      else
        alert(data.err)
    )
  $scope.showLogin = ->
    ### 显示登录窗口 ###
    i = $modal.open(
      templateUrl: 'partials/login.html'
      controller: LoginCtrl
      backdrop: 'static'
      keyboard: false
      size: 'sm'
    )
    i.result.then((user)->
      $http.post('/login', user).success((data)->
        $log.debug(data)
        $scope.isLogin = data.ok
        if data.ok
          $scope.id = data.id
          $scope.user = data.user
        else
          alert(data.err)
      )
    ,->
      $log.info '取消'
    )

WebCtrl.$inject = [
  '$scope'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

