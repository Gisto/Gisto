'use strict';
/* Controllers */

function listGistCtrl($scope, $http) {
    $http.get('http://localhost:3000/gists')
            .success(function(data) {
        for (var item in data) {
            data[item].tags = data[item].description ? data[item].description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
        }
        $scope.gists = data;
    });
}

function singleGistCtrl($scope, $routeParams, $http) {
    $http.get('http://localhost:3000/gists/' + $routeParams.gistId)
            .success(function(data) {
        $scope.single = data;
        $scope.tags = data.description ? data.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
            $scope.keypressCallback = function($event) {
                alert('Voila!');
                $event.preventDefault();
            };
        $scope.save = function($event) {

            if ($event) {
                $event.preventDefault();
            }

            var data = {
                id: $scope.single.id,
                files: {}
            };

            for(var file in $scope.single.files) {
                data.files[file] = {
                    content: $scope.single.files[file].content
                };
            }

            $http.post('http://localhost:3000/gists/edit', data)
                .success(function(response) {
                    if (response.status === 'ok') {
                        $('.ok').slideDown('slow');
                        $('.ok span').text('Gist saved');
                        $scope.single.history = response.data.history;
                        setTimeout(function() {
                            $('.ok').slideUp();
                        }, 2500);
                    }
                });

        };

    });
}

function commentsGistCtrl($scope, $routeParams, $http) {
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
            $scope.gistContent,
            $scope.gistPublic
        ]);
        var files = {};
        files[$scope.gistFileName] = {
            content: $scope.gistContent
        };
        var data = {
            description: $scope.gistTitle,
            public: $scope.gistPublic,
            files: files
        };
        $http.post('http://localhost:3000/gists/create', data)
                .success(function(response) {
            window.location.href = "#/gist/" + response.id
        });
    }
}

