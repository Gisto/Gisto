'use strict';

function loginCtrl($scope, ghAPI, appSettings, notificationService) {
    $scope.submit = function () {
        $scope.spinner = true;
        ghAPI.login($scope.user, $scope.pass, function (response) {
            if (response.status === 201) {
                console.log(response);
                var data = {};
                data.token = response.data.token;
                ghAPI.setToken(response.data.token);
                data.theme = appSettings.get('default') || 'default';
                data.avatar = appSettings.get('none') || 'none';
                data.editor_theme = appSettings.get('tomorrow') || 'tomorrow';
                localStorage.settings = JSON.stringify(data);
                window.location.href = '#/';
            } else {
                $scope.spinner = false;
                console.warn('[!!!] >>> Log-in failed - server responded with error.');
                $('.warn').slideDown('slow');
                $('.warn span').text('Log-in failed - server responded with error');
                setTimeout(function () {
                    $('.warn').slideUp();
                }, 2500);
            }
        });
    };
}