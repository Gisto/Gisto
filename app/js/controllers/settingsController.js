'use strict';

function settingsCtrl($scope, appSettings, $http, $location, $timeout) {
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
        data.editor_theme = $scope.editor_theme;
        data.font_size = $scope.font_size;
        data.ui_zoom = $scope.ui_zoom;
        data.min_lines = $scope.min_lines;
        data.max_lines = $scope.max_lines;
        var saved = appSettings.set(data, function (response) {
            if (response.status === 'ok') {
                console.log('SAVED SETTINGS');
                window.location.reload();
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
                        console.info('SETTING FILE (NEW)', incomingSettings.data);
                        localStorage.settings = JSON.stringify(incomingSettings.data);
                        console.info('NEW SETTING', JSON.stringify(incomingSettings.data));
                        window.location.reload();
                    });
                });
            }, 0);
        }, false);
        chooser.click();
    };

    $scope.export_settings = function () {
        appSettings.loadSettings().then(function (result) {
            result['token'] = '';
            var json = JSON.stringify(result, null, 2);
            var blob = new Blob([json], {type: "octet/stream"});
            console.warn('BLOB', blob);
            var url = URL.createObjectURL(blob);
            window.location.assign(url);
        });
    };
}