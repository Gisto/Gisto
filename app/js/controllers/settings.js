'use strict';

function settingsCtrl($scope, appSettings,$rootScope) {
    $scope.themes = appSettings.theme_list;
    $scope.editor_theme = appSettings.get('editor_theme') || 'tomorrow';
    $scope.editor_themes = appSettings.editor_theme_list;
    $scope.font_sizes = appSettings.font_size;
    $scope.font_size = appSettings.get('font_size') || 13;
    $scope.theme = appSettings.get('theme') || 'default';
    $scope.token = appSettings.get('token') || '';
    $scope.avatar = appSettings.get('avatar') || '';
    $scope.update_settings = function () {
        var data = {};
        data.theme = $scope.theme;
        data.editor_theme = $scope.editor_theme;
        data.font_size = $scope.font_size;
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

    $rootScope.goToSite = function(url,params) {

        for(var i = 0, l = params.length; i < l; i++){
            var out = url.replace(/{(\d+)}/g,function(match, i) {
                return typeof params[i] != 'undefined' ? params[i] : match;
            });
        }
        console.log('Out:',out);
        gui.Shell.openExternal(out);
    };
}