'use strict';

function mainCtrl($scope, $http, appSettings, $q) {

    appSettings.loadSettings().then(function(result) {
        $scope.latestVersion = appSettings.get('latestVersion');
        console.log($scope.latestVersion);
    });

    $scope.currentVersion = '';
    $scope.updateAvailable = false;

    $scope.gotoSite = function () {
        gui.Shell.openExternal('http://www.gistoapp.com');
    };

    $q.all([
        $http.get('./package.json'),
        $http.get('https://raw.githubusercontent.com/Gisto/Gisto/master/changelog.md'),
        $http.get('https://raw.githubusercontent.com/Gisto/Gisto/master/LICENSE'), // need to be news feed of some sort
        $http.get('https://api.github.com/repos/gisto/gisto/issues?state=all')
    ]).then(function(mainData){
        $scope.currentVersion = mainData[0].data.version;
        $scope.changes = mainData[1].data;
        $scope.license = mainData[2].data;
        $scope.issues = mainData[3].data;
    },function(err){
        console.warn('$q error',err);
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