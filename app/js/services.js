'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
        value('version', '0.1');


//
// This is the working indicator
//
angular.module('JobIndicator', [])
        .config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function(data, headersGetter) {
        // todo start the spinner here
        $('.loading').slideDown('slow');
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
            $('.loading').slideUp('slow');
            return response;

        }, function(response) {
            // do something on error
            // todo hide the spinner
            //$('.warn').slideDown('slow');
            //$('.warn span').text('Something not right');
            console.info('services.js -> "JobIndicator" condition went to error.')
            return $q.reject(response);
        });
    };
});

var ghAPI = angular.module('gitHubAPI', [], function($provide) {
    $provide.factory('ghAPI', function($http) {
        var api_url = 'https://api.github.com/gists',
                token = '?access_token=' + localStorage.access_token;

        return {
            // GET /gists
            gists: function(callback) {
                $http.get(api_url + token).then(function(response) {
                    return callback(response.data);
                });
            },
            // GET /gists/:id
            gist: function(id, callback) {
                $http.get(api_url + '/' + id + token).then(function(response) {
                    return callback(response.data);
                });
            },
            // POST /gists
            create: function(data, callback) {
                $http({
                    method: 'POST',
                    url: api_url + token,
                    data: data
                }).then(function(response) {
                    return callback({
                        status: 'ok',
                        data: response
                    });
                });
            },
            // PATCH /gists/:id
            edit: function(id, data, response) {
                $http({
                    method: 'PATCH',
                    url: api_url + '/' + id + token,
                    data: data
                }).success(function(data, status, headers, config) {
//                    return response({
//                        data: data,
//                        status: status,
//                        headers: headers(),
//                        config: config
//                    });
                    console.log(data);
                    console.log(status);
                    console.log(headers());
                    console.log(config);
                }).error(function(data, status, headers, config) {
                    return callback({
                        status: status,
                        header: headers,
                        data: data
                    });
                });
            },
            // DELETE /gists/:id
            delete: function(id, callback) {
                $http.delete(api_url + '/' + id + token).then(function(response) {
                    return callback({
                        status: 'ok'
                    });
                });
            },
            // GET /gists/starred
            starred: function() {
            },
            // PUT /gists/:id/star
            star: function() {
            },
            // DELETE /gists/:id/star
            unstar: function() {
            },
            // GET /gists/:id/star
            is_starred: function() {
            },
            // POST /gists/:id/forks
            fork: function() {
            }
        };
    });
});
