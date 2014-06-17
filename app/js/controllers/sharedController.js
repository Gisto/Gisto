'use strict';

function sharedCtrl($scope, ghAPI, gistData, $routeParams, $location, notificationService, $window) {

    $scope.author = $routeParams.user;

    ghAPI.gist($routeParams.id).then(function(gist) {
        $scope.gist = gist;
    });

    console.log($scope.gist);

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