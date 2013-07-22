'use strict';

function commentsGistCtrl($scope, $routeParams, ghAPI) {
    if ($scope.gist.comments > 0) {
        ghAPI.comments($routeParams.gistId, function (response) {
            if (response.status === 200) {
                $scope.comments = response.data;
            } else {
                console.warn('[!!!] >>> Comments not loaded - server responded with error.');
            }
        });
    }
}