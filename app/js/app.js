'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui', 'myApp.filters', 'myApp.services', 'myApp.directives', 'JobIndicator', 'gitHubAPI']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'app.html', redirectTo: function () {
            if (!localStorage.token) {
                return '/login';
            }
        }});
        $routeProvider.when('/login', {templateUrl: 'login.html', controller: loginCtrl});
        $routeProvider.when('/gist/:gistId', {templateUrl: 'partials/single-gist.html', controller: singleGistCtrl, reloadOnSearch: false});
        $routeProvider.when('/create', {templateUrl: 'partials/create.html', controller: createGistCtrl, reloadOnSearch: false});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
