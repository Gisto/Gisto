'use strict';

angular.module('gisto.service.gitHubAPI', [
    'gisto.service.gistData',
    'gisto.service.appSettings',
    'gisto.service.requestHandler'
], function ($provide) {
    $provide.factory('ghAPI', function ($http, gistData, appSettings, requestHandler, $q) {
        var api_url = 'https://api.github.com/gists',
            token = appSettings.get('token');
        var api = {

            setToken: function (newToken) {
                token = newToken;
            },

            getLoggedInUser: function () {

                var deferred = $q.defer();

                var user = appSettings.get('username');

                if (user) {
                    console.log('from saved data');
                    deferred.resolve({login: user});
                    return deferred.promise;
                }

                requestHandler({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data) {
                        appSettings.set({
                           username: data.login,
                           gravatar_id: data.gravatar_id
                        });
                        deferred.resolve(data);
                    }).error(function (error) {
                        console.log('Could not get logged in user', error);
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            // POST /authorizations
            login: function (user, pass, callback, twoStepAuthCode) {

                var headers = {
                    "Authorization": "Basic " + btoa(user + ":" + pass),
                    "Content-Type": "application/x-www-form-urlencoded"
                };

                if (twoStepAuthCode) {
                    headers['X-GitHub-OTP'] = twoStepAuthCode;
                }

                requestHandler({
                    method: 'POST',
                    url: 'https://api.github.com/authorizations',
                    data: {"scopes": [
                        "gist"
                    ],
                        "note": "Gisto"
                    },
                    headers: headers
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

                requestHandler({
                    method: 'GET',
                    url: url,
                    headers: headers
                }).success(function (data, status, headers, config) {
                        for (var item in data) { // process and arrange data
                            data[item].tags = data[item].description ? data[item].description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                            data[item].single = {};
                            data[item].filesCount = Object.keys(data[item].files).length;
                        }

                        // Set lastUpdated for 60 sec cache
                        data.lastUpdated = new Date();

                        // Set avatar
                        appSettings.setOne('avatar', data[item].user.gravatar_id);
                        gistData.list.push.apply(gistData.list, data); // transfer the data to the data service
                        // localStorage.gistsLastUpdated = data.headers['last-modified'];

                        var header = headers();
                        if (header.link) {
                            var links = header.link.split(',');
                            for (var link in links) {
                                link = links[link];
                                if (link.indexOf('rel="next') > -1) {
                                    var nextPage = link.match(/[0-9]+/)[0];

                                    if (!pageNumber || nextPage > pageNumber) {
                                        api.gists(null, nextPage);
                                        return; // end the function before it reaches starred gist list call
                                    }
                                }
                            }
                        }

                        // end of the paging calls
                        api.starred(function (response) {
                            for (var s in response.data) {
                                var gist = gistData.getGistById(response.data[s].id);
                                if (gist) {
                                    gist.has_star = true;
                                }
                            }
                        });

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

                var deferred = $q.defer();

                var gist = gistData.getGistById(id) || {}; // get the currently viewed gist or an empty object to apply the data

                requestHandler({
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

                        // save timestamp of pull
                        data.lastUpdated = new Date();
                        console.log(data.lastUpdated);

                        gist.single = data; // update the current gist with the new data

                        deferred.resolve(gist);

                    }).error(function (data, status, headers, config) {
                        console.log({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });

                        deferred.reject(status);
                    });

                return deferred.promise;
            },

            // GET /gists/:id/:revision
            history: function (id,revId) {

                var deferred = $q.defer();

                var gist = gistData.getGistById(id) || {}; // get the currently viewed gist or an empty object to apply the data

                requestHandler({
                    method: 'GET',
                    url: api_url + '/' + id + '/' + revId,
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

                        // save timestamp of pull
                        data.lastUpdated = new Date();
                        console.log(data.lastUpdated);

                        gist.history = data; // update the current gist with the new data

                        deferred.resolve(gist);

                    }).error(function (data, status, headers, config) {
                        console.log({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });

                        deferred.reject(status);
                    });

                return deferred.promise;
            },

            // POST /gists
            create: function (data, callback) {
                requestHandler({
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
                requestHandler({
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
                requestHandler({
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
                requestHandler({
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

            // POST /gists/:id/comments
            add_comment: function (id, data, callback) {
                requestHandler({
                    method: 'POST',
                    url: api_url + '/' + id + '/comments',
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

            // DELETE /gists/:gist_id/comments/:id
            delete_comment: function (gist_id, comment_id, callback) {
                requestHandler({
                    method: 'DELETE',
                    url: api_url + '/' + gist_id + '/comments' + '/' + comment_id,
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
            starred: function (callback, pageNumber) {
                var url = pageNumber ? api_url + '/starred' + '?page=' + pageNumber : api_url + '/starred';
                requestHandler({
                    method: 'GET',
                    url: url,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {

                        // return the data
                        callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });

                        var header = headers();
                        if (header.link) {
                            var links = header.link.split(',');
                            for (var link in links) {
                                link = links[link];
                                if (link.indexOf('rel="next') > -1) {
                                    var nextPage = link.match(/[0-9]+/)[0];

                                    if (!pageNumber || nextPage > pageNumber) {
                                        api.starred(callback, nextPage);
                                        return; // end the function before it reaches starred gist list call
                                    }
                                }
                            }
                        }

                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },

            // PUT /gists/:id/star
            star: function (id, callback) {
                requestHandler({
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
                requestHandler({
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
                requestHandler({
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
            fork: function (id) {

                var deferred = $q.defer();

                requestHandler({
                    method: 'post',
                    url: api_url + '/' + id + '/forks',
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        gistData.list.push(data);
                        deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                });

                return deferred.promise;

            }
        };

        return api;
    });
});