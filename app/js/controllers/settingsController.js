'use strict';

function settingsCtrl($scope, appSettings, $rootScope) {
    $scope.themes = appSettings.theme_list;
    $scope.editor_themes = appSettings.editor_theme_list;
    $scope.font_sizes = appSettings.font_size;

    appSettings.loadSettings().then(function (result) {
        $scope.editor_theme = result['editor_theme'] || 'tomorrow';
        $scope.font_size = result['font_size'] || '13';
        $scope.min_height = result['min_height'] || '';
        $scope.max_height = result['max_height'] || '';
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


    angular.element('.the-gist pre').css({
        'min-height': $scope.min_height + 'px',
        'max-height': $scope.max_height + 'px'
    });
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
        data.min_height = $scope.min_height;
        data.max_height = $scope.max_height;
        var saved = appSettings.set(data, function (response) {
            if (response.status === 'ok') {
                console.log('SAVED SETTINGS');
                window.location.reload();
            } else {
                console.log('NOT SAVED SETTINGS');
            }
        });
    };
}