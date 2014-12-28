###
confirmCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

ConfirmCtrl= ($scope, $modalInstance, msg)->
  $scope.msg = msg
  $scope.ok = ->
    $modalInstance.close('ok')
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

ConfirmCtrl.$inject = [
  '$scope'
  '$modalInstance'
  'msg'
]

