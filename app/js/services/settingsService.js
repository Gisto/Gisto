'use strict';

angular.module('gisto.service.appSettings', [], function ($provide) {
    $provide.factory('appSettings', function ($rootScope) {
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
                avatarUrl: 'https://secure.gravatar.com/avatar/'
            },


            loadSettings: function () {

                if (!localStorage.settings) {
                    return; // no settings saved do nothing
                }

                var parsedSettings = JSON.parse(localStorage.settings);
                for (var key in parsedSettings) {
                    settings.data[key] = parsedSettings[key];
                }

            },

            isLoggedIn: function (callback) {

                if (settings.data['token']) {
                    return true;
                } else {
                    document.location.href = '#/login';
                }
            },

            logOut: function () {
                $rootScope.edit = false;
                settings.data = [];
                delete localStorage.settings;
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
                console.log('recieved new settings', data);
                console.log('saved new settings', settings.data);
                settings.data['last_modified'] = new Date().toUTCString();
                localStorage.settings = JSON.stringify(settings.data);

                if (callback) {
                    return callback({
                        status: 'ok'
                    });
                }

            },

            setOne: function (key, new_data, callback) {
                settings.data[key] = new_data;
                localStorage.settings = JSON.stringify(settings.data);
            }
        };

        settings.loadSettings();

        return settings;
    });
});