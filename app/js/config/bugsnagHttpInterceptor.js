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
            if (!isGitHubStarNotFound(rejection)) {
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

        function isGitHubStarNotFound(rejection) {
            return rejection.status === 404 && rejection.config.url.indexOf('/star') > -1
        }
    }
})();