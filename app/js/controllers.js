'use strict';

/* Controllers */

function theGistList($scope, $http) {
    $http.get('http://localhost:3000/gists')
        .success(function(data) {
            $scope.gists = data;
    });
}

function theGist($scope, $routeParams, $http) {
    $http.get('http://localhost:3000/gists/' + $routeParams.gistId)
        .success(function(data) {
            $scope.single = data;
    });
}

function theGistComments($scope, $routeParams, $http) {
    $http.get('http://localhost:3000/gists/comments/' + $routeParams.gistId)
        .success(function(data) {
            $scope.comments = data;
    });
} 

