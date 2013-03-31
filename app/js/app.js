'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/none', {templateUrl: 'partials/empty.html'});
    $routeProvider.when('/gist/:gistId', {templateUrl: 'partials/single-gist.html', controller: theGist});
    $routeProvider.otherwise({redirectTo: '/none'});
  }]);
