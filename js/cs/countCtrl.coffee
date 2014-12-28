###
countCtrl.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
CountCtrl = ($scope, $route, $http, $log)->
  ### 统计 ###
  $log.debug '统计'
  $scope.$parent.name = 'count'

CountCtrl.$inject = [
  '$scope'
  '$route'
  '$http'
  '$log'
]

