###
app.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
angular.module('web', [
  'ngRoute'
  'ui.bootstrap'
  'hotkey'
  'LocalStorageModule'
]).config(['$routeProvider', ($routeProvider)->
  $routeProvider.
    when('/genealogy',
      templateUrl: 'partials/genealogy.html'
      controller: 'GenealogyCtrl'
    ).when('/page',
      templateUrl: 'page.html'
      controller: 'PageCtrl'
    ).otherwise({
      redirectTo: '/genealogy'
    })
])
