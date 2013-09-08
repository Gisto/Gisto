'use strict';

function loginCtrl($scope, ghAPI, appSettings, notificationService) {

    $scope.tokenAttempts = 0;

    $scope.step1 = function() {
        $scope.step2 = false;
    };

    function handleLogin(response) {
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
        } else if (response.status === 401 && response.headers['x-github-otp']) {
            $scope.step2 = true;
            $scope.spinner = false;
            if ($scope.tokenAttempts === 0) {
                $('.info').slideDown();
            } else {
                $('.info').slideUp();
                $('.warn').slideDown().find('span').text('Authenticator token incorrect');
            }
            console.log(response);
        } else {
            $scope.spinner = false;
            console.warn('[!!!] >>> Log-in failed - server responded with error.');
            $('.warn').slideDown('slow');
            $('.warn span').text('Log-in failed - server responded with error');
            setTimeout(function () {
                $('.warn').slideUp();
            }, 2500);
        }
    }

    $scope.submit = function () {
        $scope.spinner = true;
        if ($scope.code) {
            $scope.tokenAttempts++;
        }
        ghAPI.login($scope.user, $scope.pass, handleLogin, $scope.code);
    };

//    $scope.step2Submit = function() {
//        alert('2 step submit');
//        if (!$scope.code) {
//            $('.warn').slideDown();
//            return;
//        }
//
//        ghAPI.login($scope.user, $scope.pass, handleLogin, $scope.code);
//    };
}