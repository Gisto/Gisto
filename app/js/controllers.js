'use strict';

/* Controllers */

function theGistList($scope, $http) {
    $http.get('http://localhost:3000/gists').success(function(data) {
        $scope.gists = data;
    });
}

function theGist($scope, $routeParams, $http) {
    $http.get('http://localhost:3000/gists/' + $routeParams.gistId).success(function(data) {
        //angular.forEach(data, function(item) {
        //  if (item.id === $routeParams.gistId) 
            $scope.single = data;
        //});
    });
}

