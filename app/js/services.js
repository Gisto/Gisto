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
            console.info('services.js -> "JobIndicator" condition went to error.');
            return $q.reject(response);
        });
    };
});
var ghAPI = angular.module('gitHubAPI', [], function($provide) {
    $provide.factory('ghAPI', function($http) {
        var api_url = 'https://api.github.com/gists',
                token = localStorage.token;
        var api = {
// POST /authorizations
            login: function(user, pass, callback) {
                $http({
                    method: 'POST',
                    url: 'https://api.github.com/authorizations',
                    data: {"scopes": [
                            "repo",
                            "gist",
                            "user"
                        ],
                        "note": "Gisto"
                    },
                    headers: {
                        "User-Agent": "Gisto/1.0.0",
                        "Authorization": "Basic " + btoa(user + ":" + pass),
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).success(function(data, status, headers, config) {
//                    console.log('>>> DATA');
//                    console.log(data);
//                    console.log('>>> STATUS');
//                    console.log(status);
//                    console.log('>>> HEADERS');
//                    console.log(headers());
//                    console.log('>>> CONFIG');
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                }).error(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                });
            },
            // GET /gists
            gists: function(callback, updateOnly, pageNumber) {
                var url = pageNumber ? api_url + '?page=' + pageNumber : api_url,
                    headers = {
                        Authorization: 'token ' + token
                    };

                if (updateOnly) {
                    headers['If-Modified-Since'] = localStorage.gistsLastUpdated;
                }

                $http({
                    method: 'GET',
                    url: url,
                    headers: headers
                }).success(function(data, status, headers, config) {
                    var data = {
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    };
                    localStorage.gistsLastUpdated = data.headers['last-modified'];
                    callback(data);

                  var links = data.headers.link.split(',');
                  for (var link in links) {
                      link = links[link];
                      if (link.indexOf('rel="next') > -1) {
                          pageNumber = link.match(/[0-9]+/)[0];
                          api.gists(callback, null, pageNumber);
                      }
                  }
                }).error(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                });
            },
            // GET /gists/:id
            gist: function(id, callback) {
                $http({
                    method: 'GET',
                    url: api_url + '/' + id,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                }).error(function(data, status, headers, config) {
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                });
            },
            // POST /gists
            create: function(data, callback) {
                $http({
                    method: 'POST',
                    url: api_url,
                    data: data,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                }).error(function(data, status, headers, config) {
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                });
            },
            // PATCH /gists/:id
            edit: function(id, data, callback) {
                $http({
                    method: 'PATCH',
                    url: api_url + '/' + id,
                    data: data,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                }).error(function(data, status, headers, config) {
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                });
            },
            // DELETE /gists/:id
            delete: function(id, callback) {
                $http({
                    method: 'DELETE',
                    url: api_url + '/' + id,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                }).error(function(data, status, headers, config) {
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                });
            },
            // GET /gists/:id/comments
            comments: function(id, callback) {
                $http({
                    method: 'GET',
                    url: api_url + '/' + id + '/comments',
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers());
//                    console.log(config);
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
                    });
                }).error(function(data, status, headers, config) {
                    return callback({
                        data: data,
                        status: status,
                        headers: headers(),
                        config: config
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

        return api;
    });
});
