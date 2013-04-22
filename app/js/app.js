'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui', 'myApp.filters', 'myApp.services', 'myApp.directives', 'JobIndicator', 'gitHubAPI', 'gistData']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/empty.html'});
        $routeProvider.when('/login', {templateUrl: 'login.html', controller: loginCtrl});
        $routeProvider.when('/settings', {templateUrl: 'partials/settings.html'/*, controller: loginCtrl*/});
        $routeProvider.when('/gist/:gistId', {templateUrl: 'partials/single-gist.html', controller: singleGistCtrl});
        $routeProvider.when('/create', {templateUrl: 'partials/create.html', controller: createGistCtrl});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
