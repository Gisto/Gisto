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
        
    // $scope.$on('$viewContentLoaded', function() {
    //     var editors = $('.editor');
    //     for (var i = 0, limit = editors.length; i < limit; i++) {
    //         console.log(editors[i]);
    //         var editor = ace.edit(editors[i]);
    //             editor.setTheme("ace/theme/monokai");
    //             editor.getSession().setMode("ace/mode/javascript");
    //     }
    // });

}

function theGistComments($scope, $routeParams, $http) {
    $http.get('http://localhost:3000/gists/comments/' + $routeParams.gistId)
        .success(function(data) {
            $scope.comments = data;
    });
}

function createGistCtrl($scope, $routeParams, $http) {
    $scope.save = function() {
        console.log([
            $scope.gistTitle,
            $scope.gistFileName,
            $scope.gistContent
        ]);

        var files = {};
        files[$scope.gistFileName] = {
            content: $scope.gistContent
        };

        $http.defaults.headers.put['Access-Control-Allow-Origin']='*';
        $http.defaults.headers.put['Access-Control-Allow-Methods']='POST, GET, PUT, DELETE, OPTIONS';
        $http.defaults.headers.put['Access-Control-Allow-Headers']='X-Requested-With, Content-Type';

        $http.put('http://localhost:3000/gists/create', "{description: $scope.gistTitle, public: false, files: files}" )
            .success(function(data) {
                console.log(data.id);
                window.location.href = "#/gist/" + data.id
            });
    }
}

