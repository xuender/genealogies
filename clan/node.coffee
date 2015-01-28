###
nodeCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

class Node
  @isRoot: ->
    false
  @isRemove: (t, root)->
    (not (
      (t.C and t.C.length > 0) or
      (t._C and t._C.length > 0) or
      (t.P and t.P.length > 0)
    )) or
    ( root and t.C and t.C.length == 1)


NodeCtrl= ($scope, $log, $modalInstance, node, title)->
  $scope.node = node
  $scope.title = title
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
  'title'
]

