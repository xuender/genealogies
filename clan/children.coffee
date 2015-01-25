###
children.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###

ChildrenCtrl= ($scope, $log, $modalInstance, t, p, c)->
  $scope.t = t
  $scope.c = c
  $scope.p = p
  $scope.ok = ->
    $log.debug 'ok'
    ret = []
    for c in $scope.c
      if c.s
        ret.push(
          Id: c.Id
        )
    $modalInstance.close(ret)
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

ChildrenCtrl.$inject = [
  '$scope'
  '$log'
  '$modalInstance'
  't'
  'p'
  'c'
]

