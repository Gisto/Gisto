'use strict';

/**
 * This is the working indicator
 */

angular.module('myApp.services', []);

angular.module('JobIndicator', [])
    .config(function ($httpProvider) {
        var numLoadings = 0;
        $httpProvider.responseInterceptors.push(function () {
            return function (promise) {
                numLoadings++;
                $('.loading').show();
                var hide = function (r) {
                    if (!(--numLoadings)) {
                        $('.loading').slideUp();
                    }
                    return r;
                };
                //console.log('**************** LOADING ****************');
                //console.log(slideUp(r));
                return promise.then(hide, hide);
            };
        });
    });

angular.module('gitHubAPI', ['gistData', 'appSettings'], function ($provide) {
    $provide.factory('ghAPI', function ($http, gistData, appSettings) {
        var api_url = 'https://api.github.com/gists',
            token = appSettings.get('token');
        var api = {

            setToken: function (newToken) {
                token = newToken;
            },

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
                        Authorization: 'token ' + JSON.parse(localStorage.settings).token
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

                        // Set avatar
                        console.log(data[item].user.gravatar_id);
                        appSettings.setOne('avatar', data[item].user.gravatar_id);

                        gistData.list.push.apply(gistData.list, data); // transfer the data to the data service
                        // localStorage.gistsLastUpdated = data.headers['last-modified'];

                        //var headers = headers();
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
                        api.is_starred(data.id, function (response) {
                            if (response.status === 204) {
                                data.starred = true;
                            } else {
                                data.starred = false;
                            }
                            console.log('Is it starred: ' + data.starred);
                        });
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
            star: function (id, callback) {
                $http({
                    method: 'PUT',
                    url: api_url + '/' + id + '/star',
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

            // DELETE /gists/:id/star
            unstar: function (id, callback) {
                $http({
                    method: 'DELETE',
                    url: api_url + '/' + id + '/star',
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

            // GET /gists/:id/star
            is_starred: function (id, callback) {
                $http({
                    method: 'get',
                    url: api_url + '/' + id + '/star',
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

angular.module('appSettings', [], function ($provide) {
    $provide.factory('appSettings', function () {
        var settings = {

            theme_list: ['default', 'nite', 'dark', 'dark-blue'],

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

                if (localStorage.settings && JSON.parse(localStorage.settings).token !== undefined) {
                    return true;
                } else {
                    document.location.href = '#/login';
                }
            },

            logOut: function () {
                delete localStorage.settings;
                document.location.href = '#/login';
            },

            getAll: function () {
                var all_settings = JSON.parse(localStorage.settings);
                return all_settings;
            },

            get: function (name) {
                if (settings.isLoggedIn()) {
                    var storage = JSON.parse(localStorage.settings);
                    return storage[name];
                }
            },

            set: function (data, callback) {
                var new_data = {};
                new_data.token = data.token;
                new_data.theme = data.theme;
                new_data.avatar = data.avatar;
                new_data.editor_theme = data.editor_theme;
                new_data.last_modified = new Date().toUTCString();
                if (localStorage.settings === JSON.stringify(new_data)) {
                    if (callback) {
                        return callback({
                            status: 'ok'
                        });
                    }
                }
            },

            setOne: function (key, new_data, callback) {
                var old_data = settings.getAll();
                old_data[key] = new_data;
                settings.set(old_data);
            }
        };

        return settings;
    });
});