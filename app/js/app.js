'use strict';

// Declare app level module which depends on filters, and services
angular.module('gisto', [
        'ui.utils',
        'gisto.filter.removeTags',
        'gisto.filter.truncate',
        'gisto.filter.publicOrPrivet',
        'gisto.filter.removeTags',
        'gisto.filter.markDown',
        'gisto.filter.codeLanguage',
        'gisto.filter.removeTagSymbol',
        'gisto.directive.scrollTo',
        'gisto.directive.editor',
        'gisto.service.gistData',
        'gisto.service.requestHandler',
        'gisto.service.gitHubAPI',
        'gisto.service.appSettings'
    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/empty.html',
            controller: mainCtrl
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: loginCtrl
        });
        $routeProvider.when('/settings', {
            templateUrl: 'partials/settings.html'
        });
        $routeProvider.when('/gist/:gistId', {
            templateUrl: 'partials/single-gist.html',
            controller: singleGistCtrl
        });
        $routeProvider.when('/create', {
            templateUrl: 'partials/create.html',
            controller: createGistCtrl
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]);