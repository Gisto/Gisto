'use strict';

function loginCtrl($scope, ghAPI, appSettings, $location, $rootScope) {

    $scope.tokenAttempts = 0;
    $scope.useManualToken = false;
    $scope.active_endpoint = 'public';

    $rootScope.enterpriseMode = false;

    $scope.toggleManualToken = function () {
        $scope.useManualToken = !$scope.useManualToken;
    };

    $scope.step1 = function () {
        $scope.step2 = false;
    };

    $scope.showEnterprise = function () {
        $scope.showEnterpriseSetup = true;
    };

    function isEnterpriseAndEmpty() {
        console.log('isEnterprise', $scope.active_endpoint === 'enterprise' && (!$scope.enterprise.api_url || !$scope.enterprise.client_id || !$scope.enterprise.client_secret));
        return $scope.active_endpoint === 'enterprise' && (!$scope.enterprise.api_url || !$scope.enterprise.client_id || !$scope.enterprise.client_secret);
    }

    $scope.hideEnterprise = function () {

        if (isEnterpriseAndEmpty()) {
            $scope.toggleEnterpriseMode();
        }

        $scope.showEnterpriseSetup = false;
    };

    $scope.saveEnterpriseConfig = function () {

        appSettings.loadSettings().then(function (settings) {

            // strip last slash on api url
            if ($scope.enterprise.api_url.slice(-1) === '/') {
                $scope.enterprise.api_url = $scope.enterprise.api_url.slice(0, -1);
            }

            // check if /api/v3 is missing from the url and add it
            if ($scope.enterprise.api_url && $scope.enterprise.api_url.toLowerCase().indexOf('/api/v3') === -1) {
                $scope.enterprise.api_url += '/api/v3';
            }

            // check for http(s) protocol and add if missing (assuming http is used)
            if ($scope.enterprise.api_url && $scope.enterprise.api_url.search(/^http(s?):\/\//i) === -1) {
                $scope.enterprise.api_url = 'http://' + $scope.enterprise.api_url;
            }

            settings.endpoints['enterprise'] = {
                api_url: $scope.enterprise.api_url,
                client_id: $scope.enterprise.client_id,
                client_secret: $scope.enterprise.client_secret
            };

            console.log('attempting to save', settings.endpoints['enterprise']);

            // save changes to settings
            appSettings.set(settings.endpoints);

            console.log('attempting to update ghapi');
            // update running instance of GitHub API service
            ghAPI.setEndpoint('enterprise', settings.endpoints['enterprise']);
        });
        $scope.hideEnterprise();
    };

    $scope.toggleEnterpriseMode = function () {
        $scope.active_endpoint = $scope.active_endpoint === 'enterprise' ? 'public' : 'enterprise';
        ghAPI.setActiveEndpoint($scope.active_endpoint);
        console.log($scope.active_endpoint);

        // save the default endpoint
        appSettings.set({
            active_endpoint: $scope.active_endpoint
        });


        if (isEnterpriseAndEmpty()) {
            $scope.showEnterprise();
        }
    };

    // watch for changes on the active endpoint and update the enterprise state
    $scope.$watch(function() {
        return $scope.active_endpoint
    }, function(value) {
        console.log('watch value changed', value);
        $rootScope.enterpriseMode = value === 'enterprise';
    })



    appSettings.loadSettings().then(function (settings) {
        $scope.enterprise = settings.endpoints['enterprise'];
        $scope.active_endpoint = settings.active_endpoint;
    });

    function handleLogin(response) {
        if (response.status === 201) {
            console.log(response);

            appSettings.loadSettings().then(function (result) {

                appSettings.set({
                    token: response.data.token
                });
                ghAPI.setToken(response.data.token);

                console.log('saved token');
                $location.url('/');
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

    $scope.manualLogin = function () {

        ghAPI.isTokenValid($scope.manualToken).then(function () {
            // token is valid save and redirect to homepage
            appSettings.loadSettings().then(function (result) {
                appSettings.set({
                    token: $scope.manualToken
                });
                ghAPI.setToken($scope.manualToken);

                $location.url('/');
            });

        }, function (error) {
            $('.warn').slideDown('slow');
            $('.warn span').text('Log-in failed - Token is invalid');
            setTimeout(function () {
                $('.warn').slideUp();
            }, 2500);
        });

    };
}