'use strict';

function sharedCtrl($scope, ghAPI, gistData, $routeParams, $location, notificationService, $window) {

    $scope.author = $routeParams.user;

    $scope.gist = ghAPI.gist($routeParams.id);

    $scope.fork = function() {
        ghAPI.fork($routeParams.id).then(function(data) {
            notificationService.remove($routeParams.id);
            notificationService.send('notificationRead', {gistId: $routeParams.id});
            $location.url('/gist/' + data.id);
        });
    };

    $scope.reject = function() {
        notificationService.remove($routeParams.id);
        console.log('sending notificationRead request');
        notificationService.send('notificationRead', {gistId: $routeParams.id});
        $window.history.back(-1);
    };

};