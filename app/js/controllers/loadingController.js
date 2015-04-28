(function() {
    'use strict';

    angular.module('gisto')
        .controller('loadingCtrl', ['appSettings', '$location', '$http', 'ghAPI', '$rootScope', loadingCtrl]);

    function loadingCtrl(appSettings, $location, $http, ghAPI, $rootScope) {

        /**
         * Application bootstrapping controller, load all the settings and configures services
         * before launching the application
         */

            // load public endpoints
        $http.get('./config.json').then(function (conf) {
            // load github application credentials
            ghAPI.setEndpoint('public', {
                api_url: 'https://api.github.com',
                client_id: conf.data['client_id'],
                client_secret: conf.data['client_secret']
            });

            appSettings.loadSettings().then(function (settings) {
                // settings loaded
                console.log(settings);

                if (settings) {

                    // load initial ui settings
                    $rootScope.ui_zoom = settings.ui_zoom;

                    // load enterprise endpoints
                    var enterpriseEndpoint = {
                        api_url: settings.endpoints['enterprise'].api_url,
                        client_id: settings.endpoints['enterprise'].client_id,
                        client_secret: settings.endpoints['enterprise'].client_secret
                    };

                    ghAPI.setEndpoint('enterprise', enterpriseEndpoint);

                    // if enterprise mode is active and there are missing credentials revert it to public mode
                    if (settings.active_endpoint === 'enterprise' && ( !enterpriseEndpoint.api_url || !enterpriseEndpoint.client_id || !enterpriseEndpoint.client_secret )) {
                        console.log('reverted to public mode');
                        appSettings.set({
                            active_endpoint: 'public'
                        });
                    }
                }

                // set the active endpoint
                var active_endpoint = settings.active_endpoint || 'public';
                ghAPI.setActiveEndpoint(active_endpoint);
                $rootScope.enterpriseMode = settings.active_endpoint === 'enterprise' ? true : false;

                // bootstrapping complete, transfer user to appropriate route
                if (settings.token) {
                    // set existing token and redirect to main page
                    ghAPI.setToken(settings.token);

                    // attempt to verify that the token is actually valid and not expired
                    ghAPI.isTokenValid(settings.token).then(function (isVerified) {
                        if (isVerified) {
                            $location.url('/');
                        } else {
                            // token invalid -  redirect back to login screen
                            $location.url('/login');
                        }
                    }, function (error) {
                        // token invalid -  redirect back to login screen
                        $location.url('/login');
                    });


                } else {
                    // no saved token redirect to login page
                    $location.url('/login');
                }
            }, function (error) {
                $location.url('/login');
            });


        });

    }

})();