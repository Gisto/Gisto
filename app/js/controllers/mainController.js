'use strict';

function mainCtrl($scope, $http, appSettings) {
    $scope.latestVersion = appSettings.get('latestVersion');
    $scope.currentVersion = '';
    $scope.updateAvailable = false;

    $scope.gotoSite = function () {
        gui.Shell.openExternal('http://www.gistoapp.com');
    };

    // get the current version number
    $http.get('./package.json').success(function (data) {
        $scope.currentVersion = data.version;
    });

    var timestamp = new Date().getTime() - 86400000; // 1 day ago
    if (!$scope.latestVersion || $scope.latestVersion.timestamp < timestamp) {
        console.log('save');
        // get the latest version number
        $http({
            url: 'https://api.github.com/repos/Gisto/Gisto/contents/app/package.json',
            headers: {
                Accept: "application/vnd.github.3.raw"
            },
            method: 'get'
        }).success(function (data) {
                appSettings.setOne('latestVersion', {version: data.version, timestamp: new Date().getTime() });
            });

    }

    $scope.$watch('currentVersion + latestVersion', function () {

        if ($scope.currentVersion && $scope.latestVersion && $scope.currentVersion !== $scope.latestVersion.version) {
            $scope.updateAvailable = true;
        }
    });
}