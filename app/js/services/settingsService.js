'use strict';

angular.module('gisto.service.appSettings', [], function ($provide) {
    $provide.factory('appSettings', function () {
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

                var settings = JSON.parse(localStorage.settings) || {};

                for (var key in data) {
                    settings[key] = data[key];
                }
                settings.last_modified = new Date().toUTCString();
                localStorage.settings = JSON.stringify(settings);

                if (callback) {
                    return callback({
                        status: 'ok'
                    });
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