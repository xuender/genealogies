###
nodeCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

NodeCtrl= ($scope, $log, $modalInstance, node, genealogy)->
  $scope.node = node
  $scope.genealogy = genealogy
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
  $scope.add = (t)->
    ### 增加父亲，母亲，伴侣 ###
    $scope.genealogy.add($scope.node.Id, t)
NodeCtrl.$inject = [
  '$scope'
  '$log'
  '$modalInstance'
  'node'
  'genealogy'
]

