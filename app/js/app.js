'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'JobIndicator']).
        config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/empty.html'});
        $routeProvider.when('/gist/:gistId', {templateUrl: 'partials/single-gist.html', controller: theGist});
        $routeProvider.when('/create', {templateUrl: 'partials/create.html', controller: createGistCtrl});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);



//
// This is the working indicator
//
angular.module('JobIndicator', [])
        .config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function(data, headersGetter) {
        // todo start the spinner here
        $('.ok').slideDown('slow');
        $('.ok span').text('loading')
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
})
// register the interceptor as a service, intercepts ALL angular ajax http calls
        .factory('myHttpInterceptor', function($q, $window) {
    return function(promise) {
        return promise.then(function(response) {
            // do something on success
            // todo hide the spinner
            $('.ok').slideUp('slow');
            return response;

        }, function(response) {
            // do something on error
            // todo hide the spinner
            $('.ok').slideUp('slow');
            return $q.reject(response);
        });
    };
});