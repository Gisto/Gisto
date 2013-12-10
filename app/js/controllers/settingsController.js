'use strict';

function settingsCtrl($scope, appSettings,$rootScope) {
    $scope.themes = appSettings.theme_list;
    $scope.editor_theme = appSettings.get('editor_theme') || 'tomorrow';
    $scope.editor_themes = appSettings.editor_theme_list;
    $scope.font_sizes = appSettings.font_size;
    $scope.font_size = appSettings.get('font_size') || '13';
    $scope.min_height = appSettings.get('min_height') || '';
    $scope.max_height = appSettings.get('max_height') || '';
    $scope.theme = appSettings.get('theme') || 'default';
    $scope.anim = appSettings.get('anim') || 1;
    $scope.token = appSettings.get('token') || '';
    $scope.avatar = appSettings.get('avatar') || '';
    angular.element('.the-gist pre').css({
        'min-height': $scope.min_height + 'px',
        'max-height': $scope.max_height + 'px'
    });
    $scope.update_settings = function () {
        var data = {};
        data.theme = $scope.theme;
        data.anim = $scope.anim;
        data.editor_theme = $scope.editor_theme;
        data.font_size = $scope.font_size;
        data.min_height = $scope.min_height;
        data.max_height = $scope.max_height;
        data.token = appSettings.get('token');
        data.avatar = appSettings.get('avatar');
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