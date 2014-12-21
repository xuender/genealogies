###
post.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
POST_TYPE =
  question: '问题'
  bug: '错误'
  feature: '功能建议'
  
PostCtrl = ($scope, $modalInstance, $http, $log, type)->
  ### 日志控制 ###
  $scope.type = type
  $scope.new = true
  $scope.name = POST_TYPE[type]
  $scope.$watch('type', (n, o)->
    $scope.new = true
    $scope.name = POST_TYPE[n]
  )
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
