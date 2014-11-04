###
nodeCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

NodeCtrl= ($scope, $log, $modalInstance, node)->
  $scope.node = node
  $scope.ok = ->
    $log.debug 'ok'
    $modalInstance.close(
      N: $scope.node.N
      G: $scope.node.G
      B: $scope.node.B
      L: $scope.node.L
      D: $scope.node.D
      T: $scope.node.T
      Id: $scope.node.Id
    )
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

