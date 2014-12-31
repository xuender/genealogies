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
  ### 反馈控制 ###
  $scope.new = true
  $scope.name = POST_TYPE[type]
  $scope.$watch('type', (n, o)->
    $scope.new = true
    $scope.name = POST_TYPE[n]
  )
  $scope.p =
    title: ''
    content: ''
    type: type
  $scope.ok = ->
    $http.post('/post', $scope.p).success((data)->
      if data.ok
        $log.debug data
        $modalInstance.dismiss('cancel')
      else
        alert(data.err)
    )
  $scope.cancel = ->
    $modalInstance.dismiss('cancel')

PostCtrl.$inject = [
  '$scope'
  '$modalInstance'
  '$http'
  '$log'
  'type'
]
