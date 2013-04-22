'use strict';

/**
 * This is the working indicator
 */

angular.module('myApp.services', []);

angular.module('JobIndicator', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            $('.loading').slideDown('slow');
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                $('.loading').slideUp('slow');
                return response;
            }, function (response) {
//$('.warn').slideDown('slow');
//$('.warn span').text('Something not right');
                console.info('services.js -> "JobIndicator" condition went to error.');
                return $q.reject(response);
            });
        };
    });

angular.module('gitHubAPI', ['gistData'], function ($provide) {
    $provide.factory('ghAPI', function ($http, gistData) {
        var settings = JSON.parse(localStorage.settings);
        var api_url = 'https://api.github.com/gists',
            token = settings.token;
        var api = {

            // POST /authorizations
            login: function (user, pass, callback) {
                $http({
                    method: 'POST',
                    url: 'https://api.github.com/authorizations',
                    data: {"scopes": [
                        "gist"
                    ],
                        "note": "Gisto"
                    },
                    headers: {
                        "Authorization": "Basic " + btoa(user + ":" + pass),
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // GET /gists
            gists: function (updateOnly, pageNumber) {
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
                }).success(function (data, status, headers, config) {

                        for (var item in data) { // process and arrange data
                            data[item].tags = data[item].description ? data[item].description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                            data[item].single = {};
                        }

                        gistData.list.push.apply(gistData.list, data); // transfer the data to the data service
                        // localStorage.gistsLastUpdated = data.headers['last-modified'];

                        var headers = headers();
                        if (headers.link) {
                            var links = headers.link.split(',');
                            for (var link in links) {
                                link = links[link];
                                if (link.indexOf('rel="next') > -1) {
                                    pageNumber = link.match(/[0-9]+/)[0];
                                    console.log(pageNumber);
                                    api.gists(null, pageNumber);
                                }
                            }
                        }

                    }).error(function (data, status, headers, config) {
                        console.log({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // GET /gists/:id
            gist: function (id) {
                var gist = gistData.getGistById(id); // get the currently viewed gist
                $http({
                    method: 'GET',
                    url: api_url + '/' + id,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        gist.single = data; // update the current gist with the new data
                    }).error(function (data, status, headers, config) {
                        console.log({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // POST /gists
            create: function (data, callback) {
                $http({
                    method: 'POST',
                    url: api_url,
                    data: data,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // PATCH /gists/:id
            edit: function (id, data, callback) {
                $http({
                    method: 'PATCH',
                    url: api_url + '/' + id,
                    data: data,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // DELETE /gists/:id
            delete: function (id, callback) {
                $http({
                    method: 'DELETE',
                    url: api_url + '/' + id,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // GET /gists/:id/comments
            comments: function (id, callback) {
                $http({
                    method: 'GET',
                    url: api_url + '/' + id + '/comments',
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // GET /gists/starred
            starred: function () {
            },

            // PUT /gists/:id/star
            star: function () {
            },

            // DELETE /gists/:id/star
            unstar: function () {
            },

            // GET /gists/:id/star
            is_starred: function () {
            },

            // POST /gists/:id/forks
            fork: function () {
            }
        };

        return api;
    });
});

angular.module('gistData', [], function ($provide) {
    $provide.factory('gistData', function () {
        var dataService = {
            list: [],
            getGistById: function (id) {
                for (var gist in dataService.list) {
                    gist = dataService.list[gist];
                    if (gist.id === id) {
                        return gist;
                    }
                }
            }
        };
        return dataService;
    });
});

angular.module('appSetting', [], function ($provide) {
    $provide.factory('appSetting', function () {
        var settings = {
                theme_list: ['default', 'nite'],
                editor_theme_list: [
                    'ambiance',
                    'chaos',
                    'chrome',
                    'clouds',
                    'clouds_midnight',
                    'cobalt',
                    'crimson_editor',
                    'dawn',
                    'dreamweaver',
                    'eclipse',
                    'github',
                    'idle_fingers',
                    'kr',
                    'merbivore',
                    'merbivore_soft',
                    'mono_industrial',
                    'monokai',
                    'pastel_on_dark',
                    'solarized_dark',
                    'solarized_light',
                    'textmate',
                    'tomorrow',
                    'tomorrow_night_blue',
                    'tomorrow_night_bright',
                    'tomorrow_night_eighties',
                    'tomorrow_night',
                    'twilight',
                    'vibrant_ink',
                    'xcode'
                ],
                isLoggedIn: function (callback) {
                    var storage = JSON.parse(localStorage.settings);
                    if(storage.token && storage.token !== '') {
                        return true;
                    } else {
                        return false;
                    }
                },
                logOut: function (callback) {
                    if (storage.clear()) {
                        return callback({
                            status: 'ok'
                        });
                    }
                },
                getSettings: function (callback) {
                    var storage = JSON.parse(localStorage.settings);
                    return callback({
                        status: 'ok',
                        settings: storage
                    });
                },
                setSettings: function (data, callback) {
                    new_data.token = data.token;
                    new_data.theme = data.theme;
                    new_data.editor_theme = data.editor_theme;
                    new_data.last_modified = new Date.now();
                    localStorage.settings = JSON.stringify(new_data);
                },
                updateSetting: function(key, new_data, callback) {

                }
            };
        return settings;
    });
});