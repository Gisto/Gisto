'use strict';

angular.module('gisto.service.gitHubAPI', [
    'gisto.service.gistData',
    'gisto.service.appSettings',
    'gisto.service.requestHandler',
    'gisto.filter.matchTags'
], function ($provide) {
    $provide.factory('ghAPI', function ($http, gistData, appSettings, requestHandler, $q, $rootScope, $filter, $route, databaseFactory, onlineStatus, ModalService) {
        var token = appSettings.get('token'),
            lastGistsUpdate = null,
            notifiedOfflineCache = false,
            aggregateGists = false,
            active_endpoint = appSettings.get('active_endpoint'),
            endpoints = {
                'public': {
                    api_url: '',
                    client_id: '',
                    client_secret: ''
                },
                'enterprise': {
                    api_url: '',
                    client_id: '',
                    client_secret: ''
                }

            };

        var api = {

            // update function for polling gists updates
            startUpdate: function () {
                return api.gists(true);
            },

            getEndpoint: function (endpoint) {
                endpoint = endpoint || active_endpoint;
                return endpoints[endpoint];
            },

            setEndpoint: function (endpoint, data) {
                console.log('setting endpoint', endpoint, data);
                angular.forEach(data, function (value, key) {
                    endpoints[endpoint][key] = value;
                });

                console.log(endpoints);
            },

            setActiveEndpoint: function (activeEndpoint) {
                active_endpoint = activeEndpoint
            },

            setToken: function (newToken) {
                token = newToken;
            },

            getLoggedInUser: function () {

                var deferred = $q.defer();

                appSettings.loadSettings().then(function (result) {

                    var user = result['username'];

                    if (user) {
                        console.log('from saved data');
                        deferred.resolve({login: user});
                        return deferred.promise;
                    }

                    requestHandler({
                        method: 'GET',
                        url: endpoints[active_endpoint].api_url + '/user',
                        headers: {
                            Authorization: 'token ' + result['token']
                        }
                    }).success(function (data) {
                        appSettings.loadSettings().then(function (result) {
                            appSettings.set({
                                username: data.login,
                                gravatar_id: data.gravatar_id,
                                avatarUrl: data.avatar_url
                            });
                        });

                        deferred.resolve(data);
                    }).error(function (error) {
                        console.log('Could not get logged in user', error);
                        deferred.reject(error);
                    });

                });

                return deferred.promise;
            },

            isTokenValid: function (token) {

                var deferred = $q.defer();

                requestHandler({
                    method: 'GET',
                    url: endpoints[active_endpoint].api_url + '/user',
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data) {
                    console.log(data);
                    deferred.resolve(true);
                }).error(function (error) {
                    console.log('Could not verify token', error);
                    deferred.reject(error);
                });

                return deferred.promise;

            },

            // POST /authorizations
            login: function (user, pass, callback, twoStepAuthCode) {
                var headers = {
                    "Authorization": "Basic " + btoa(user + ":" + pass)
                };

                if (twoStepAuthCode) {
                    headers['X-GitHub-OTP'] = twoStepAuthCode;
                }
                console.log(endpoints, active_endpoint);
                requestHandler({
                    method: 'POST',
                    url: endpoints[active_endpoint].api_url + '/authorizations',
                    data: {
                        "scopes": [
                            "gist"
                        ],
                        note: "Gisto - Snippets made simple",
                        note_url: "http://www.gistoapp.com",
                        client_id: endpoints[active_endpoint].client_id,
                        client_secret: endpoints[active_endpoint].client_secret
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
            gists: function (updateOnly, pageNumber, deferred) {
                var deferred = deferred || $q.defer();

                if (onlineStatus.isOnline()) {

                    databaseFactory.find().then(function () {

                        var url = pageNumber ? endpoints[active_endpoint].api_url + '/gists?page=' + pageNumber : endpoints[active_endpoint].api_url + '/gists',
                            headers = {
                                Authorization: 'token ' + token
                            };

                        if (updateOnly && lastGistsUpdate) {
                            headers['If-Modified-Since'] = lastGistsUpdate;
                        }

                        requestHandler({
                            method: 'GET',
                            url: url,
                            headers: headers
                        }).success(function (data, status, headers, config) {
                            for (var item in data) { // process and arrange data
                                data[item].tags = data[item].description ? $filter('matchTags')(data[item].description) : [];
                                data[item].single = {};
                                data[item].filesCount = Object.keys(data[item].files).length;

                                /*
                                 check if the gists contains file over 1MB
                                 if they do mark them as gists with big files
                                 the check is done using a byte size comparison 1048576 = 1MB
                                 due to the gist list api does not return if the file
                                 is going to be truncated or not, so we have to measure each file size in bytes.
                                 */
                                angular.forEach(data[item].files, function (fileSize) {
                                    if (fileSize.size > 1048576) {
                                        data[item].bigFile = true;
                                        //console.info(' --- file size', fileSize.size);
                                    }
                                });
                            }

                            // Set lastUpdated for 60 sec cache
                            data.lastUpdated = new Date();

                            // get the current gist id being edited if there is one.
                            var editInProgressGistId = $route.current.params['gistId'] || null;

                            // apply update for gists
                            data.forEach(function (newGist) {

                                // only update gists which are currently not being worked on.
                                // in the future pop a notification to notify the user.
                                if (editInProgressGistId && editInProgressGistId === newGist.id) {
                                    return;
                                }

                                var gist = gistData.getGistById(newGist.id);

                                if (!gist) {
                                    console.log('could not find gist');
                                    // can't find a match, assume new gist
                                    gistData.list.push(newGist);
                                }

                            });

                            var header = headers();
                            lastGistsUpdate = header['last-modified'];
                            if (header.link) {
                                var links = header.link.split(',');

                                var endOfPagination = false;
                                links = _(links).reverse().value();
                                for (var link in links) {
                                    link = links[link];

                                    if (link.indexOf('rel="last') > -1) {
                                        var lastPage = parseInt(link.match(/\?page=(\d+)/)[1], 10);

                                        // if there are more than 2000 gists warn the user
                                        if (lastPage > (2000 / 30) && notifiedOfflineCache) {
                                        //if (lastPage > 1 && !notifiedOfflineCache) {
                                            ModalService.showModal({
                                                templateUrl: "js/modals/yesno/yesno.html",
                                                controller: "YesNoController",
                                                inputs: {
                                                    title: 'Caution: caching offline gists may cause service disruptions',
                                                    description: [
                                                        'You are about to cache more than 2000 gists.',
                                                        'Due to GitHub rate limiting that allows only 5000 calls',
                                                        'per hour, you may experience issues with Gisto',
                                                        'until your rate limit has renewed.',
                                                        'Are you sure you want to do this?'
                                                    ].join(' ')
                                                }
                                            }).then(function(modal) {
                                                return modal.close;
                                            }).then(function(result) {
                                                if (result) {
                                                    aggregateGists = true;
                                                    notifiedOfflineCache = true;
                                                }

                                                return api.gists(updateOnly, pageNumber, deferred);
                                            });
                                        } else {
                                            aggregateGists = true;
                                        }
                                    }


                                    if (link.indexOf('rel="next') > -1) {
                                        var nextPage = parseInt(link.match(/\?page=(\d+)/)[1], 10);
                                        if (!pageNumber || nextPage > pageNumber) {
                                            api.gists(updateOnly, nextPage, deferred);
                                            return; // end the function before it reaches starred gist list call
                                        }
                                    }
                                }
                            }

                            if (aggregateGists) {
                                api.aggregateGists();
                            }


                            // resolve the promise when finished getting all the gists from paginated results
                            deferred.resolve();

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

                            deferred.reject([data, status, headers, config]);
                        });


                    });
                } else {
                    databaseFactory.find().then(function (gists) {
                        gistData.list.push.apply(gistData.list, gists);
                        deferred.resolve();
                    });
                }

                return deferred.promise;

            },

            aggregateGists: function () {

                gistData.list.forEach(function (gist) {
                    // check if there is a matching gist in the database
                    databaseFactory.findOne({id: gist.id}).then(function (localGist) {
                        // if no local gist
                        if (!localGist) {
                            // get the gist and save in database
                            api.gist(gist.id);
                        } else {
                            // if local gist found
                            // check the gist dates to determine which is newer

                            var serverDate = moment(gist.updated_at);
                            var clientDate = moment(localGist.updated_at);

                            if (serverDate.isBefore(clientDate)) {
                                // TODO: CONFLICT ask user which version to keep
                                console.warn('GIST CONFLICT DETECTED', {
                                    localGistTimestamp: localGist.updated_at,
                                    remoteGistTimestamp: gist.updated_at
                                });
                            }
                        }
                    });
                });

                // sync local changes
                api.syncChanges();
            },

            // GET /gists/:id
            gist: function (id) {

                var deferred = $q.defer();

                var gist = gistData.getGistById(id) || {}; // get the currently viewed gist or an empty object to apply the data

                requestHandler({
                    method: 'GET',
                    url: endpoints[active_endpoint].api_url + '/gists/' + id,
                    headers: {
                        Authorization: 'token ' + token,
                        'Cache-Control': 'no-cache'
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

                    gist.single = data; // update the current gist with the new data
                    gist.single._original = angular.copy(data); //backup original gist

                    // Get files which are more than 1MB in size
                    angular.forEach(gist.single.files, function (filedata, filename) {
                        if (filedata.truncated === true) {
                            requestHandler.get(filedata.raw_url, {stopNotification: true}).success(function (result) {
                                gist.single.files[filename].content = result;
                                // push the data to history as well as it is the original
                                // content of the gist
                                gist.single._original.files[filename].content = result;
                                $rootScope.$broadcast('ace-update', filename);
                            });
                        }
                    });

                    databaseFactory.findOne({id: gist.id}).then(function (localGist) {
                        if (localGist) {
                            databaseFactory.update(gist);
                        } else {
                            databaseFactory.insert(gist);
                        }
                    });

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

            // GET /users/:user/followers
            followers: function (callback) {
                appSettings.loadSettings().then(function (result) {
                    var followers = result['followers'];
                    if (!followers) {
                        followers = {
                            list: [],
                            lastUpdated: 0
                        };
                    }

                    var yesterday = new Date().getTime() - 86400000;
                    if (followers && followers.lastUpdated < yesterday) {
                        requestHandler({
                            method: 'GET',
                            url: endpoints[active_endpoint].api_url + '/user/followers',
                            headers: {
                                Authorization: 'token ' + result['token']
                            }
                        }).success(function (data) {

                            data = data.map(function (item) {
                                return item.login
                            });

                            angular.forEach(data, function (item) {
                                if (followers.list.indexOf(item) === -1) {
                                    followers.list.push(item);
                                }
                            });

                            followers.lastUpdated = new Date().getTime();
                            appSettings.set({followers: followers});

                            return callback({
                                data: followers.list
                            });
                        });
                    }

                    return callback({
                        data: followers.list
                    });


                });
            },

            // GET /gists/:id/:revision
            history: function (id, revId) {

                var deferred = $q.defer();

                appSettings.loadSettings().then(function (result) {

                    var gist = gistData.getGistById(id) || {}; // get the currently viewed gist or an empty object to apply the data

                    requestHandler({
                        method: 'GET',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/' + revId,
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    deferred.reject('could not get token');
                });

                return deferred.promise;
            },

            generateUUID: function () {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },

            // POST /gists
            create: function (data, callback) {


                appSettings.loadSettings().then(function (result) {


                    if (!onlineStatus.isOnline()) {
                        var files = {};
                        angular.forEach(data.files, function (value, key) {
                            files[key] = {
                                filename: key,
                                content: value.content
                            };
                        });
                        var id = api.generateUUID();
                        var gist = angular.extend(data, {
                            id: id,
                            owner: {
                                login: result.username
                            },
                            lastUpdated: new Date(),
                            files: files,
                            single: {
                                files: files
                            }
                        });

                        databaseFactory.addToQueue('create', id);
                        databaseFactory.insert(gist);

                        return callback({
                            data: gist,
                            status: 201
                        });
                    }

                    requestHandler({
                        method: 'POST',
                        url: endpoints[active_endpoint].api_url + '/gists',
                        data: data,
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            updateLocalGist: function (id, data, localEdit) {
                var defer = $q.defer();

                databaseFactory.findOne({id: id}).then(function (gist) {
                    if (gist) {
                        var originalGist = gistData.getGistById(id);

                        gist.description = data.description;
                        originalGist.description = data.description;
                        //gist.single.files = angular.extend(data.files, gist.single.files);
                        _.each(gist.single.files, function (file, key) {
                            //angular.extend(file, data.files[key]);
                            //file.notContent = file.content;
                            file.content = data.files[key].content;
                            originalGist.single.files[key].content = data.files[key].content;
                        });

                        if (localEdit) {
                            gist.updated_at = new Date();
                            originalGist.updated_at = new Date();
                            databaseFactory.addToQueue('update', id);
                        }

                        databaseFactory.update(gist);


                        defer.resolve(gist);
                    }
                });

                return defer.promise;
            },

            // PATCH /gists/:id
            edit: function (id, data, callback) {

                appSettings.loadSettings().then(function (result) {

                    if (!onlineStatus.isOnline()) {

                        api.updateLocalGist(id, data, true).then(function (gist) {
                            return callback({
                                data: gist,
                                status: 200
                            });
                        });

                        // exit function, do not try to perform http requests
                        return;
                    }

                    requestHandler({
                        method: 'PATCH',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id,
                        data: data,
                        headers: {
                            Authorization: 'token ' + result['token']
                        }
                    }).success(function (data, status, headers, config) {

                        // update gist if needed
                        api.updateLocalGist(id, data);

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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // DELETE /gists/:id
            delete: function (id, callback) {

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'DELETE',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id,
                        headers: {
                            Authorization: 'token ' + result['token']
                        }
                    }).success(function (data, status, headers, config) {
                        if (callback) {
                            return callback({
                                data: data,
                                status: status,
                                headers: headers(),
                                config: config
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        if (callback) {
                            return callback({
                                data: data,
                                status: status,
                                headers: headers(),
                                config: config
                            });
                        }
                    });

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // GET /gists/:id/comments
            comments: function (id, callback, pageNumber) {
                pageNumber = pageNumber || 1;
                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'GET',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/comments?page=' + pageNumber,
                        headers: {
                            Authorization: 'token ' + result['token']
                        }
                    }).success(function (data, status, headers, config) {

                        var header = headers();
                        if (header.link) {
                            var links = header.link.split(',');
                            for (var link in links) {
                                link = links[link];
                                if (link.indexOf('rel="next') > -1) {
                                    var nextPage = link.match(/\?page=(\d+)/)[1];

                                    if (!pageNumber || nextPage > pageNumber) {
                                        api.comments(id, callback, nextPage);
                                    }
                                }
                            }
                        }

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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // POST /gists/:id/comments
            add_comment: function (id, data, callback) {

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'POST',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/comments',
                        data: data,
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // DELETE /gists/:gist_id/comments/:id
            delete_comment: function (gist_id, comment_id, callback) {

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'DELETE',
                        url: endpoints[active_endpoint].api_url + '/gists/' + gist_id + '/comments' + '/' + comment_id,
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // GET /gists/starred
            starred: function (callback, pageNumber) {

                appSettings.loadSettings().then(function (result) {

                    var url = pageNumber ? endpoints[active_endpoint].api_url + '/gists/starred' + '?page=' + pageNumber : endpoints[active_endpoint].api_url + '/gists/starred';
                    requestHandler({
                        method: 'GET',
                        url: url,
                        headers: {
                            Authorization: 'token ' + result['token']
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
                                    var nextPage = link.match(/\?page=(\d+)/)[1];

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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // PUT /gists/:id/star
            star: function (id, callback) {

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'PUT',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/star',
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // DELETE /gists/:id/star
            unstar: function (id, callback) {

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'DELETE',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/star',
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // GET /gists/:id/star
            is_starred: function (id, callback) {

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'get',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/star',
                        headers: {
                            Authorization: 'token ' + result['token']
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

                }, function (error) {
                    console.log('could not get token');
                });
            },

            // POST /gists/:id/forks
            fork: function (id) {

                var deferred = $q.defer();

                appSettings.loadSettings().then(function (result) {


                    requestHandler({
                        method: 'post',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/forks',
                        headers: {
                            Authorization: 'token ' + result['token']
                        }
                    }).success(function (data, status, headers, config) {
                        data.tags = data.description ? data.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                        data.filesCount = Object.keys(data.files).length;
                        gistData.list.unshift(data);
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });

                }, function (error) {
                    deferred.reject('could not get token');
                });

                return deferred.promise;

            },

            commits: function (id) {
                var deferred = $q.defer();

                appSettings.loadSettings().then(function (result) {

                    requestHandler({
                        method: 'get',
                        url: endpoints[active_endpoint].api_url + '/gists/' + id + '/commits',
                        headers: {
                            Authorization: 'token ' + result['token']
                        },
                        stopNotification: true
                    }).success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });

                }, function (error) {
                    deferred.reject('could not get token');
                });

                return deferred.promise;
            },

            syncChanges: function () {

                databaseFactory.getChanges().then(function (changes) {
                    console.log(changes);

                    changes.forEach(function (change) {

                        var gist = databaseFactory.get(change.item).then(function (gist) {
                            console.log(gist);

                            api.commits(change.item).then(function (gistCommits) {
                                var serverDate = moment(_.first(gistCommits).committed_at);
                                var clientDate = moment(gist.updated_at);
                                var lastCommit = _.first(_.at(gistCommits, 1));
                                var lastCommitDate = lastCommit ? moment(lastCommit.committed_at) : null;

                                if (clientDate.isAfter(serverDate)) {
                                    // update the server
                                    var data = {
                                        description: gist.description,
                                        id: gist.id,
                                        files: gist.single.files
                                    };
                                    api.edit(gist.id, data, function () {
                                        console.log('synced change, removing: ', change._id);
                                        databaseFactory.removeChange(change._id);
                                    });
                                }

                                if (clientDate.isBefore(serverDate) && clientDate.isAfter(lastCommitDate)) {
                                    // TODO: handle gist conflict
                                    console.warn('********** GIST CONFLICT ***********');
                                }
                            });
                        });

                    });
                });
            }

        };

        $rootScope.$on('isOnline', _.debounce(api.syncChanges, 1000));

        return api;
    });
});
