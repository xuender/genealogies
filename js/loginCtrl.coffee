###
login.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
LoginCtrl = ($scope, $http, $log, $modalInstance, m, cid)->
  ### 登录控制 ###
  $scope.old = false
  $scope.user =
    phone: ''
    password: ''
    m: m
    CaptchaId: cid
    Solution: ''
  $scope.img = "/captcha/img/#{ cid }"
  count = 0
  $scope.reload = ->
    count++
    $scope.img = "/captcha/reload/#{ cid }?#{ count }"
  $scope.ok= (valid)->
    # 登录
    $scope.old = true
    if valid
      if $scope.user.m == 'l'
        url = '/login'
      else
        url = '/register'
      $http.post(url, $scope.user).success($scope.return)
  $scope.return = (data)->
    $scope.user.CaptchaId = data.cid
    $scope.img = "/captcha/img/#{ data.cid }"
    if data.ok
      data.data.cid = data.cid
      $modalInstance.close(data.data)
    else
      alert(data.err)
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

LoginCtrl.$inject = ['$scope', '$http', '$log', '$modalInstance', 'm', 'cid']
