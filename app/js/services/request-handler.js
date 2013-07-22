'use strict';


angular.module('gisto.service.requestHandler', [], function ($provide) {
    $provide.factory('requestHandler', function ($http) {

        function handleRequest(args) {

            if (!args.stopNotification) { // stop the notification if requested
                $('.loading').show();
            }

            var http = $http(args);

            var requestService = {
                success: function (callback) {
                    http.success(function (data, status, headers, config) {
                        // only hide the notification if there are no pending requests
                        if ($http.pendingRequests.length < 1) {
                            $('.loading').slideUp();
                        }
                        callback(data, status, headers, config); // call the user callback
                    });
                    return requestService; // return the object for chaining
                },
                error: function (callback) {
                    http.error(function (data, status, headers, config) {
                        // only hide the notification if there are no pending requests
                        if ($http.pendingRequests.length < 1) {
                            $('.loading').slideUp();
                        }
                        callback(data, status, headers, config); // call the user callback
                    });
                    return requestService; // return the object for chaining
                }
            };

            return requestService;
        }

        // create the main function mimicking $http
        var requestHandler = function (args) {
            return handleRequest(args);
        };

        // add $http sub methods support

        requestHandler.delete = function (url, config) {
            config = config || {};
            config.method = 'delete';
            config.url = url;
            return handleRequest(config);
        };

        requestHandler.get = function (url, config) {
            config = config || {};
            config.method = 'get';
            config.url = url;
            return handleRequest(config);
        };

        requestHandler.jsonp = function (url, config) {
            config = config || {};
            config.method = 'jsonp';
            config.url = url;
            return handleRequest(config);
        };

        requestHandler.post = function (url, data, config) {
            config = config || {};
            config.method = 'post';
            config.url = url;
            config.data = data;
            return handleRequest(config);
        };

        requestHandler.put = function (url, data, config) {
            config = config || {};
            config.method = 'put';
            config.url = url;
            config.data = data;
            return handleRequest(config);
        };

        return requestHandler;

    });
});