###
passwordCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
PasswordCtrl = ($scope, $modalInstance, $http, $log)->
  ### 密码修改控制 ###
  $scope.old = false
  $scope.p =
    old: ''
    password: ''
    password2: ''
  $scope.ok= (valid)->
    $scope.old = true
    if valid
      $http.post('/password', $scope.p).success((data)->
        if data.ok
          $modalInstance.dismiss('cancel')
        else
          alert(data.err)
      )
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

PasswordCtrl.$inject = [
  '$scope'
  '$modalInstance'
  '$http'
  '$log'
]
