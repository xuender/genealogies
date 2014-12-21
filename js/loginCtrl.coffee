###
login.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
LoginCtrl = ($scope, $http, $log, $modalInstance, m)->
  ### 登录控制 ###
  $scope.old = false
  $scope.user =
    phone: ''
    password: ''
    m: m
    CaptchaId: CID
    Solution: ''
  $scope.img = "/captcha/img/#{ CID }"
  count = 0
  $scope.reload = ->
    count++
    $scope.img = "/captcha/reload/#{ CID }?#{ count }"
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
    $log.debug(data)
    if data.ok
      $modalInstance.close(data.data)
    else
      CID = data.cid
      $scope.user.CaptchaId = CID
      $scope.img = "/captcha/img/#{ CID }"
      alert(data.err)
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

LoginCtrl.$inject = ['$scope', '$http', '$log', '$modalInstance', 'm']
