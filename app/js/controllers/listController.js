'use strict';

function listGistCtrl($scope, ghAPI, gistData, notificationService) {
    $scope.gists = gistData.list;
    $scope.onlineStatus = {
       state: "Offline",
       status: false
    };

    $scope.$on('ApplicationState', function(e, data) {
        console.log(data);
        $scope.onlineStatus.state = data.online ? "Online" : "Offline";
        $scope.onlineStatus.status = data.online;

    }, true);

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