'use strict';

function mainCtrl($scope, $http, appSettings) {

    appSettings.loadSettings().then(function(result) {
        $scope.latestVersion = appSettings.get('latestVersion');
        console.log($scope.latestVersion);
    });



    $scope.currentVersion = '';
    $scope.updateAvailable = false;

    $scope.gotoSite = function () {
        gui.Shell.openExternal('http://www.gistoapp.com');
    };

    // get the current version number
    $http.get('./package.json').success(function (data) {
        $scope.currentVersion = data.version;
        console.log('package json', data);
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
                console.log('network', data);
                appSettings.loadSettings().then(function(result) {

                    $scope.latestVersion = {
                        version: data.version,
                            timestamp: new Date().getTime()
                    };

                    appSettings.set($scope.latestVersion);

                }, function(error) {
                    console.log('could not load app settings');
                });

            });

    }

    $scope.$watch('currentVersion + latestVersion', function () {
        console.log('watch', $scope.currentVersion, $scope.latestVersion);
        if ($scope.currentVersion && $scope.latestVersion && $scope.currentVersion !== $scope.latestVersion.version) {
            $scope.updateAvailable = true;
        }
    });
}