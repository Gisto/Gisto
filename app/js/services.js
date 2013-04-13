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
            $('.warn').slideDown('slow');
            $('.warn span').text('Something not right');
            return $q.reject(response);
        });
    };
});

var dbService = angular.module('dbService', []);
dbService.factory('db', function() {
    return (function() {

        // private
        var db = Pouch('gisto'); // open or create the database

        // handle all db callbacks and return the data whether it succeded or not.
        var handleResponse = function(err, response) {
            if (err) {
                return {
                    status: 'error',
                    error: err
                };
            }
            return {
                status: 'ok',
                data: response
            };
        };

        // public
        var service = {};

        service.set = function(id, obj, callback) {
            obj._id = id;

            var execute = function() {
                db.put(obj, function(err, response) {
                    if (err) {
                        return callback({
                            status: 'error',
                            error: err
                        });
                    }
                    return callback({
                        status: 'ok',
                        data: response
                    });
                });
            };

            service.get(id, function(response) { // check if there is an existing version
                if (response.status === 'ok') {
                    obj._rev = response.data._rev; // update the revision number in the object
                }
                execute(); // execute the query
            });
        };

        service.get = function(id, callback) {
            db.get(id, function(err, response) {
                if (err) {
                    return callback({
                        status: 'error',
                        error: err
                    });
                }
                return callback({
                    status: 'ok',
                    data: response
                });
            });

        };

        service.delete = function(id, callback) {
            db.get(id, function(err, doc) {
                db.remove(doc, function(err, response) {
                    if (err) {
                        callback({
                            status: 'error',
                            error: err
                        });
                    }
                    return callback({
                        status: 'ok',
                        data: response
                    });
                });
            });
        };

        return service;
    })();
});

var ghAPI = angular.module('gitHubAPI', ['ngResource'], function($provide) {
    $provide.factory('ghAPI', function($http) {
        var api_url = 'https://api.github.com/gists';
        var token = '?access_token=';
        return {
            gists: function() {
                // GET /gists
                return $http.get(api_url + token).then(function(response) {
                    return response.data;
                });
            },
            gist: function(id) {
                // GET /gists/:id
                return $http.get(api_url + '/' + id + token).then(function(response) {
                    return response.data;
                });
            },
            create: function(new_gist) {
                // POST /gists
                return $http.post(api_url + token, new_gist).then(function(response) {
                    return 'OK';
                });
            },
            edit: function(id, data) {
                // PATCH /gists/:id
            },
            delete: function(id) {
                // DELETE /gists/:id
                return $http.delete(api_url + '/' + id + token).then(function(response) {
                    return 'ok';
                });
            },
            starred: function() {
                // GET /gists/starred
            },
            star: function() {
                // PUT /gists/:id/star
            },
            unstar: function() {
                // DELETE /gists/:id/star
            },
            is_starred: function() {
                // GET /gists/:id/star
            },
            fork: function() {
                // POST /gists/:id/forks
            }
        };
    });
});
