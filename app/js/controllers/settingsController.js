'use strict';

function settingsCtrl($scope, appSettings, $http, $timeout, $window, $rootScope) {
    $scope.themes = appSettings.theme_list;
    $scope.editor_themes = appSettings.editor_theme_list;
    $scope.font_sizes = appSettings.font_size;

    appSettings.loadSettings().then(function (result) {
        $scope.editor_theme = result['editor_theme'] || 'tomorrow';
        $scope.font_size = result['font_size'] || '13';
        $scope.min_lines = result['min_lines'] || '0';
        $scope.max_lines = result['max_lines'] || '50';
        $scope.theme = result['theme'] || 'default';
        $scope.anim = result['anim'] || 1;
        $scope.editor_ext = result['editor_ext'] || {};
        $scope.editor_vim_mode = result['editor_vim_mode'] || false;
        $scope.editor_word_wrap = result['editor_word_wrap'] || false;
        $scope.ui_zoom = result['ui_zoom'] || 100;
    }, function (error) {
        console.log('could not load settings');
    });

    $scope.body_zoom = function () {
        return{
            zoom: $scope.ui_zoom + '%'
        };
        console.log('body zoom', $scope.ui_zoom);
    };

    /*angular.element('.the-gist pre').css({
     'min-height': $scope.min_height + 'px',
     'max-height': $scope.max_height + 'px'
     });*/
    $scope.update_settings = function () {
        var data = {};
        data.theme = $scope.theme;
        data.anim = $scope.anim;
        data.editor_ext = {};
        for (var key in $scope.editor_ext) {
            data.editor_ext[key] = $scope.editor_ext[key];
        }
        data.editor_vim_mode = $scope.editor_vim_mode;
        data.editor_word_wrap = $scope.editor_word_wrap;
        data.editor_theme = $scope.editor_theme;
        data.font_size = $scope.font_size;
        data.ui_zoom = $scope.ui_zoom;
        data.min_lines = $scope.min_lines;
        data.max_lines = $scope.max_lines;
        var saved = appSettings.set(data, function (response) {
            if (response.status === 'ok') {
                console.log('SAVED SETTINGS');
                $window.location.href = 'index.html#/loading';
            } else {
                console.log('NOT SAVED SETTINGS');
            }
        });
    };

    $scope.import_settings = function (file) {
        var chooser = document.querySelector(file);
        chooser.addEventListener("change", function (evt) {
            console.log('NOW WE KNOW THE FILE PATH', this.value);
            var importFile = evt.target.value;
            $timeout(function () {
                $http.get(importFile).then(function (incomingSettings) {
                    console.log('SETTING FILE imported', incomingSettings);
                    // Load new settings into Gisto
                    appSettings.loadSettings().then(function (oldSettings) {
                        console.info('SETTING FILE old', oldSettings.token);
                        incomingSettings.data.token = oldSettings.token;
                        incomingSettings.data.version = oldSettings.version;
                        incomingSettings.data.timestamp = oldSettings.timestamp;
                        console.info('SETTING FILE (NEW)', incomingSettings.data);
                        appSettings.set(incomingSettings.data);
                        console.info('NEW SETTING', JSON.stringify(incomingSettings.data));
                        $rootScope.gistoReady = false;
                        $window.location.href = 'index.html#/loading';
                    });
                });
            }, 0);
        }, false);
        chooser.click();
    };

    $scope.export_settings = function () {
        appSettings.loadSettings().then(function (result) {
            result['token'] = '';
            result['last_modified'] = '';
            result['version'] = '';
            result['timestamp'] = '';
            var json = JSON.stringify(result, null, 2);
            var blob = new Blob([json], {type: "octet/stream"});
            console.warn('BLOB', blob);
            var url = URL.createObjectURL(blob);
            window.location.assign(url);
        });
    };
}