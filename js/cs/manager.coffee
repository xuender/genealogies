###
manager.coffee
Copyright (C) 2014 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
app.config(['$routeProvider', ($routeProvider)->
  $routeProvider.
    when('/count',
      templateUrl: 'partials/cs/count.html'
      controller: 'CountCtrl'
    ).when('/users',
      templateUrl: 'partials/cs/users.html'
      controller: 'UsersCtrl'
    ).when('/session',
      templateUrl: 'partials/cs/session.html'
      controller: 'SessionCtrl'
    ).when('/post',
      templateUrl: 'partials/cs/posts.html'
      controller: 'PostsCtrl'
    ).otherwise({
      redirectTo: '/count'
    })
])

