'use strict';

angular.module('gisto.service.appSettings', [], function ($provide) {
    $provide.factory('appSettings', function ($rootScope, $q, $timeout) {
        var settings = {

            theme_list: ['default', 'gisto', 'nite', 'dark', 'dark-blue'],
            font_size: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
            editor_theme_list: [
                "ambiance",
                "chaos",
                "chrome",
                "clouds",
                "clouds_midnight",
                "cobalt",
                "crimson_editor",
                "dawn",
                "dreamweaver",
                "eclipse",
                "github",
                "idle_fingers",
                "kr_theme",
                "kuroir",
                "katzenmilch",
                "merbivore",
                "merbivore_soft",
                "monokai",
                "mono_industrial",
                "pastel_on_dark",
                "solarized_dark",
                "solarized_light",
                "terminal",
                "textmate",
                "tomorrow",
                "tomorrow_night",
                "tomorrow_night_blue",
                "tomorrow_night_bright",
                "tomorrow_night_eighties",
                "twilight",
                "vibrant_ink",
                "xcode"
            ],
            data: { // default settings
                avatarUrl: 'https://secure.gravatar.com/avatar/',
                theme: 'default',
                editor_theme: 'tomorrow',
                editor_ext: []
            },

            loadSettings: function () {
                var defer = $q.defer();

                // $timeout(function() { // uncomment when you want to simulate loading delay

                // if data already loaded (first check) return data
                // if data is not loaded and localstorage settings does not exist, return default settings object
                if (settings.dataLoaded || !localStorage.settings) {
                    defer.resolve(settings.data);
                } else {
                    var parsedSettings = JSON.parse(localStorage.settings);
                    //console.log(parsedSettings);
                    // assign the data object from the json array
                    for (var key in parsedSettings) {
                        settings.data[key] = parsedSettings[key];
                    }

                    // mark settings as loaded for further checks
                    settings.dataLoaded = true;

                    defer.resolve(settings.data);
                }
                //}, 2500); // uncomment when you want to simulate loading delay

                return defer.promise;
            },

            getToken: function () {

                var defer = $q.defer();

                settings.loadSettings().then(function (result) {

                    if (result['token']) {
                        defer.resolve(result['token']);
                    } else {
                        defer.reject('no token');
                    }

                }, function (error) {
                    defer.reject(error);
                });

                return defer.promise;

            },

            isLoggedIn: function (callback) {

                settings.loadSettings().then(function (result) {

                    if (result['token']) {
                        // set as gisto ready and enable the sidebar
                        // this is done to prevent doing calls before gisto is ready to talk to github
                        $rootScope.gistoReady = true;
                        return true;
                    }

                    window.location.href = '#/login';
                }, function (error) {
                    window.location.href = '#/login';
                });
            },

            logOut: function () {
                $rootScope.edit = false;

                settings.set({
                    token: null,
                    avatarUrl: 'https://secure.gravatar.com/avatar/',
                    gravatar_id: null,
                    username: null
                });

                document.location.href = '#/login';
            },

            getAll: function () {
                return settings.data;
            },

            get: function (name) {
                if (settings.isLoggedIn()) {
                    return settings.data[name];
                }
            },

            set: function (data, callback) {
                for (var key in data) {
                    settings.data[key] = data[key];
                }
                settings.data['last_modified'] = new Date().toUTCString();
                localStorage.settings = JSON.stringify(settings.data);

                if (callback) {
                    return callback({
                        status: 'ok'
                    });
                }

            }
        };

        return settings;
    });
});