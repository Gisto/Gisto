'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('gisto', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.utils',
    'angulartics',
    'angulartics.google.analytics',
    'cfp.hotkeys',
    'angular-bugsnag',
    'gisto.filter.removeTags',
    'gisto.filter.truncate',
    'gisto.filter.publicOrPrivet',
    'gisto.filter.removeTags',
    'gisto.filter.markDown',
    'gisto.filter.codeLanguage',
    'gisto.filter.removeTagSymbol',
    'gisto.filter.matchTags',
    'gisto.filter.dotToDash',
    'gisto.filter.githubFileName',
    'gisto.directive.scrollTo',
    'gisto.directive.editor',
    'gisto.directive.toUrl',
    'gisto.directive.disableAnimate',
    'gisto.directive.toggle',
    'gisto.directive.resourceLoader',
    'gisto.directive.hotkeysPager',
    'gisto.service.gistData',
    'gisto.service.requestHandler',
    'gisto.service.gitHubAPI',
    'gisto.service.appSettings',
    'btford.socket-io',
    'gisto.service.notificationService',
    'gisto.service.onlineStatusService',
    'gisto.service.githubUrlBuilder',
    'gisto.service.socket'
]).
    config(['$routeProvider', 'bugsnagProvider', function ($routeProvider, bugsnagProvider) {

        bugsnagProvider
            .apiKey('ebc2d2615f3d6477bf3e2a55bfc86724')
            .releaseStage('development')
            .appVersion('0.2.6b')
            .beforeNotify(['$log', function ($log) {
                return function (error, metaData) {
                    $log.debug(error.name);
                    return true;
                };
            }]);

        $routeProvider.when('/', {
            templateUrl: 'partials/empty.html',
            controller: mainCtrl
        });
        $routeProvider.when('/login', {
            name: 'login',
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
        $routeProvider.when('/history/:gistId/rev/:gistRevisionId', {
            templateUrl: 'partials/history.html',
            controller: singleGistHistoryCtrl
        });
        $routeProvider.when('/create', {
            templateUrl: 'partials/create.html',
            controller: createGistCtrl
        });
        $routeProvider.when('/shared/:user/:id', {
            templateUrl: 'partials/shared.html',
            controller: sharedCtrl
        });

        $routeProvider.when('/loading', {
            templateUrl: 'partials/loading.html',
            controller: loadingCtrl
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });


    }]).
    run(function ($rootScope, $timeout, $http, $analytics) {
        $rootScope.gistoReady = false;

        $rootScope.$on('$routeChangeStart', function () {
            $rootScope.edit = false;
        });

        // gisto is ready show the window
        // delay the window by a small amount in order to
        // prevent flickering while settings are loaded.
        $timeout(function () {
            window.win.show();
        }, 300);

        $http.get('./package.json').then(function (response) {
            $analytics.eventTrack('app open', {  category: 'application', label: response.data.version });
        });

    });
