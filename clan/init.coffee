###
clan.coffee
Copyright (C) 2015 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
app.config(['$routeProvider', ($routeProvider)->
  $routeProvider.
    when('/tree',
      templateUrl: 'partials/clan/tree.html'
      controller: 'TreeCtrl'
    ).when('/contacts',
      templateUrl: 'partials/clan/contacts.html'
      controller: 'ContactsCtrl'
    ).otherwise({
      redirectTo: '/tree'
    })
])
