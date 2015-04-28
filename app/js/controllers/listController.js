(function() {
    'use strict';

    angular.module('gisto')
        .controller('listGistCtrl', ['$scope', 'ghAPI', 'gistData', '$location', 'hotkeys', listGistCtrl]);

    function listGistCtrl($scope, ghAPI, gistData, $location, hotkeys) {
        $scope.gists = gistData.list;
        $scope.onlineStatus = {
            state: "Offline",
            status: false
        };

        $scope.navigateToGist = function (gistId) {
            $location.url('gist/' + gistId);
        };

        $scope.$on('ApplicationState', function (e, data) {
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


        var searchFocusKeys = ['ctrl+f', 'command+f'];
        if (window.process.platform === 'darwin') {
            searchFocusKeys.reverse();
        }

        hotkeys.bindTo($scope)
            .add({
                combo: searchFocusKeys,
                description: 'Focus search bar',
                allowIn: ['INPUT'],
                callback: function () {
                    var element = $('#gist-search');

                    if (element.is(':focus')) {
                        element.blur();
                    } else {
                        element.focus();
                    }

                }
            });
    }

})();