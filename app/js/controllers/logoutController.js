'use strict';

function logoutCtrl($scope, appSettings, gistData) {
    $scope.logOut = function () {
        gistData.list = [];
        appSettings.logOut();
    };
}