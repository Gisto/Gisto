'use strict';

function listGistCtrl($scope, ghAPI, gistData, socket) {
    $scope.gists = gistData.list;
    // Get the gists list
    if ($scope.gists.hasOwnProperty('lastUpdated')) {
        console.log($scope.gists.lastUpdated);
        var now = new Date();
        var seconds = Math.round((now.getTime() - $scope.gists.lastUpdated.getTime()) / 1000);
        console.log(seconds + ' have passed since last LIST updated');
        if (seconds > 60) {
            ghAPI.gists();
        }
    } else {
        ghAPI.gists();
    }
}