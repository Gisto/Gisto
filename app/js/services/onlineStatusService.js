'use strict';

var onlineStatusApp = angular.module('gisto.service.onlineStatusService', []);

onlineStatusApp.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
    var onlineStatus = {};
    onlineStatus.onLine = $window.navigator.onLine;
    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    };

    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            onlineStatus.onLine = true;
        });

    }, true);

    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            onlineStatus.onLine = false;
        });
    }, true);

    return onlineStatus;
}]);