###
nodeCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

NodeCtrl= ($scope, $log, $modalInstance, node)->
  $scope.node = node
  $scope.ok = ->
    $log.debug 'ok'
    $modalInstance.close($scope.node)
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')
  $scope.openDate = ($event)->
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened = true
NodeCtrl.$inject = [
  '$scope'
  '$log'
  '$modalInstance'
  'node'
]

