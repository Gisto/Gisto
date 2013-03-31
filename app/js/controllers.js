'use strict';

/* Controllers */

function theGistList($scope, $http) {
    $http.get('gists.json').success(function(data) {
        $scope.gists = data;
    });
}

function theGist($scope, $routeParams, $http) {
    $http.get('gists.json').success(function(data) {
        angular.forEach(data, function(item) {
          if (item.id === $routeParams.gistId) 
            $scope.single = item;
        });
    });
}

