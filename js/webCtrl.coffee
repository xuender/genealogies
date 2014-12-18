###
web.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
WebCtrl = ($scope, $log, $http, $modal, lss)->
  ### 网页制器 ###
  lss.bind($scope, "isLogin", false)
  $scope.logout = ->
    ### 登出 ###
    if $scope.isLogin
      $http.get('/logout/').success((data)->
        $log.debug(data)
        $scope.isLogin = false
        $scope.user = {}
      )

  $scope.showLog = ->
    ### 显示日志 ###
    $modal.open(
      templateUrl: 'partials/log.html?v=1.html'
      controller: LogCtrl
      backdrop: 'static'
      size: 'lg'
    )
  $scope.password = ->
    # 更改密码
    i = $modal.open(
      templateUrl: 'partials/password.html?1.html'
      controller: PasswordCtrl
      backdrop: 'static'
      keyboard: false
      size: 'sm'
    )
  $scope.showLogin = (m='l')->
    ### 显示登录窗口 ###
    i = $modal.open(
      templateUrl: 'partials/login.html?1.html'
      controller: LoginCtrl
      backdrop: 'static'
      keyboard: false
      size: 'sm'
      resolve:
        m: ->
          m
    )
    i.result.then((user)->
      $scope.isLogin = true
      $scope.user = user
    ,->
      $log.info '取消'
    )
  $scope.alerts = []
  $scope.alert = (msg)->
    # 提示信息
    $scope.alerts.push(
      msg: msg
      type: 'success'
    )
  $scope.closeAlert = (index)->
    # 关闭
    $scope.alerts.splice(index, 1)
  $scope.confirm = (msg, oFunc, cFunc=null)->
    # 询问
    i = $modal.open(
      templateUrl: '/partials/confirm.html?v=2'
      controller: 'ConfirmCtrl'
      backdrop: 'static'
      keyboard: true
      size: 'sm'
      resolve:
        msg: ->
          msg
    )
    i.result.then((ok)->
      $log.debug '增加'
      $log.info ok
      oFunc()
    ,->
      if cFunc != null
        cFunc()
    )
  if 'false' == $scope.isLogin
    $scope.isLogin = false
  if $scope.isLogin
    $http.get('/login').success((data)->
      $log.debug(data)
      $scope.isLogin = data.ok
      if data.ok
        $scope.user = data.user
        $log.debug('user id:%s', data.user.Id)
    )

WebCtrl.$inject = [
  '$scope'
  '$log'
  '$http'
  '$modal'
  'localStorageService'
]

