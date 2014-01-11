'use strict';

function loginCtrl($scope, ghAPI, appSettings, $location) {

    $scope.tokenAttempts = 0;
    $scope.useManualToken = false;

    $scope.toggleManualToken = function() {
      $scope.useManualToken = !$scope.useManualToken;
    };

    $scope.step1 = function() {
        $scope.step2 = false;
    };

    function handleLogin(response) {
        if (response.status === 201) {
            console.log(response);

            appSettings.loadSettings().then(function(result) {

                appSettings.set({
                    token: response.data.token
                });
                console.log('saved token');
                window.location.href = '#/';
            });

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

    $scope.manualLogin = function() {

        ghAPI.isTokenValid($scope.manualToken).then(function() {
            // token is valid save and redirect to homepage
            appSettings.loadSettings().then(function(result) {
               appSettings.set({
                   token: $scope.manualToken
               });
               $location.url('/');
            });

        }, function(error) {
            $('.warn').slideDown('slow');
            $('.warn span').text('Log-in failed - Token is invalid');
            setTimeout(function () {
                $('.warn').slideUp();
            }, 2500);
        });

    };
}