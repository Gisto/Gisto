'use strict';

function singleGistHistoryCtrl($scope, $routeParams, gistData, ghAPI) {
    $scope.gist = gistData.getGistById($routeParams.gistId);
    $scope.version_hash = $routeParams.gistRevisionId;

    ghAPI.history($routeParams.gistId,$routeParams.gistRevisionId);
}