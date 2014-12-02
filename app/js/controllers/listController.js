'use strict';

function listGistCtrl($scope, ghAPI, gistData, $location, hotkeys) {
    $scope.gists = gistData.list;
    $scope.onlineStatus = {
       state: "Offline",
       status: false
    };

    $scope.navigateToGist = function(gistId) {
        $location.url('gist/' + gistId);
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

    var highlightedGist;
    var gistIndex;

    var searchFocusKeys = ['ctrl+f', 'command+f'];
    if (window.process.platform == 'darwin') {
        searchFocusKeys.reverse();
    }
    hotkeys.bindTo($scope)
        .add({
            combo: searchFocusKeys,
            description: 'Focus search bar',
            callback: function() {
               $('#gist-search').focus();
            }
        }).add({
           combo: 'up',
            description: 'Highlight previous gist on the list',
            callback: function() {
               if (!$scope.filteredGists) {
                   return;
               }

               if (!highlightedGist) {
                   gistIndex = 0;
                   console.log($scope.filteredGists[0].id);
                   highlightedGist = $scope.filteredGists[0].id;
                   var id = '#gist-' + $scope.filteredGists[0].id;
                   var $element = $(id);
                   console.log($element);
                   $element.find('a').addClass('focused');
               }
            }
        }).add({
            combo: 'down',
            description: 'Highlight next gist on the list',
            callback: function() {

                if (!highlightedGist) {
                    gistIndex = 0;
                    console.log($scope.filteredGists[0].id);
                    highlightedGist = $scope.filteredGists[0].id;
                    var id = '#gist-' + $scope.filteredGists[0].id;
                    var $element = $(id);
                    console.log($element);
                    $element.find('a').addClass('focused');

                    return; // only do default behaviour do not increase index again
                }


                if (gistIndex < $scope.filteredGists.length) {
                    $('aside ul li a').removeClass('focused');
                    var gist = $scope.filteredGists[++gistIndex].id;
                    $('#gist-' + gist).find('a').addClass('focused');
                    highlightedGist = gist;
                }
            }
        });
}