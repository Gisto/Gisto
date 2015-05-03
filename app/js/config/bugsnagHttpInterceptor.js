(function () {
    'use strict';

    angular
        .module('gisto')
        .factory('bugsnagHttpInterceptor', bugsnagHttpInterceptor);

    bugsnagHttpInterceptor.$inject = ['$q', 'bugsnag'];

    /* @ngInject */
    function bugsnagHttpInterceptor($q, bugsnag) {
        return {
            requestError: handleError,
            responseError: handleError
        };

        function handleError(rejection) {
            if (!shouldNotSendError(rejection)) {
                bugsnag.notify("AjaxError", rejection.status + ' on ' + rejection.config.url, {
                    request: {
                        status: rejection.status,
                        statusText: rejection.statusText,
                        url: rejection.config.url,
                        method: rejection.config.method
                    },
                    headers: {
                        headers: rejection.headers()
                    },
                    data: {
                        data: rejection.data
                    }
                }, "error");
            }

            return $q.reject(rejection);
        }

        function shouldNotSendError(rejection) {
            return isGitHubStarNotFound(rejection) ||
                    isConnectionTimeout(rejection) ||
                    isAuthorizationError(rejection) ||
                    isRateLimitReached(rejection);
        }

        function isGitHubStarNotFound(rejection) {
            return rejection.status === 404 && rejection.config.url.indexOf('/star') > -1
        }

        function isConnectionTimeout(rejection) {
            return rejection.status === 0;
        }

        function isAuthorizationError(rejection) {
            return rejection.status === 401;
        }

        function isRateLimitReached(rejection) {
            return rejection.headers()['x-ratelimit-remaining'] === "0";
        }
    }
})();