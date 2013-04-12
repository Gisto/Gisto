'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui', 'myApp.filters', 'myApp.services', 'myApp.directives', 'JobIndicator', 'dbService']).
        config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/empty.html'});
        $routeProvider.when('/gist/:gistId', {templateUrl: 'partials/single-gist.html', controller: singleGistCtrl});
        $routeProvider.when('/create', {templateUrl: 'partials/create.html', controller: createGistCtrl});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
