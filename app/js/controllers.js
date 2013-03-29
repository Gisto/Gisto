'use strict';

/* Controllers */


function MyCtrl1() {
}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

function theGistList($scope, $http) {

    $http.get('gists.json').success(function(data) {
        $scope.gists = data;
    });
    
}