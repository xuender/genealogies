###
post.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
POST_TYPE =
  feature: '功能建议'
  
PostCtrl = ($scope, $modalInstance, $http, $log, type)->
  ### 日志控制 ###
  $scope.type = type
  $scope.name = POST_TYPE[type]
  $scope.p =
    title: ''
    content: ''
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

PostCtrl.$inject = [
  '$scope'
  '$modalInstance'
  '$http'
  '$log'
  'type'
]
