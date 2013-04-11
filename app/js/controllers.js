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

        $scope.enableEdit = function() {
            $scope.edit = true;
            $('.edit').slideDown('slow');
        };
        $scope.disableEdit = function() {
            $scope.edit = false;
        };

        << << << < HEAD
                $scope.warnDeleteGist = function() {
            $('.delete').slideDown('slow');
        };
        $scope.cancelDeleteGist = function() {
            $('.delete').slideUp('slow');
        };

        $scope.del = function($event) {
            if ($event) {
                $event.preventDefault();
            }
            var data = {
                id: $scope.single.id
            };
            $http.delete('http://localhost:3000/gists/:id', data)
                    .success(function(response) {
                if (response.status === 'ok') {
                    $('.warn').slideDown('slow');
                    $('.warn span').text('Gist saved');
                    $scope.single.history = response.data.history;
                    setTimeout(function() {
                        $('.warn').slideUp();
                    }, 2500);
                }
            });
        };

        $scope.addFile = function() {
            var fileName = 'newFile' + Object.keys($scope.single.files).length + '.txt';
            $scope.single.files[fileName] = {
                content: '',
                filename: fileName,
                language: 'text'
            };
        };

        $scope.dragStart = function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.edit').slideDown('slow');
            $('.main section').addClass('dragarea');
            $('.edit span').text('Drag detected - now drop!');
            console.log('dragging start');
        };

        $scope.drop = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = event.dataTransfer;
            for (var i = 0; i < data.files.length; i++) { // For each dropped file
                var file = data.files[i];
                var reader = new FileReader();

                reader.onloadend = (function(filename) {
                    return function(event) {
                        $scope.single.files[filename] = {
                            filename: filename,
                            content: event.target.result,
                            language: 'html'
                        };
                        $scope.$digest();
                    }
                })(file.name);

                reader.readAsText(file);
                $('.edit').slideUp('slow');
                $('.ok').slideDown('slow');
                $('.main section').removeClass('dragarea');
                $('.ok span').html('Dropped: <b>' + file.name + '</b>');
                reader.onloadend = (function(filename) {
                    return function(event) {
                        $scope.single.files[filename] = {
                            filename: filename,
                            content: event.target.result,
                            language: 'html'
                        };
                        $scope.$digest();
                    }
                })(file.name);

                reader.readAsText(file);

            }
        };

        $scope.dragEnd = function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('drag end');
        };



        $scope.save = function($event) {
            $('.loading span').text('Saving...');
            $('.edit').slideUp();
            if ($event) {
                $event.preventDefault();
            }

            var data = {
                description: $scope.single.description,
                id: $scope.single.id,
                files: {}
            };

            for (var file in $scope.single.files) {
                data.files[file] = {
                    content: $scope.single.files[file].content,
                    filename: $scope.single.files[file].filename
                };
            }

            $http.post('http://localhost:3000/gists/edit', data)
                    .success(function(response) {
                if (response.status === 'ok') {
                    $('.ok').slideDown('slow');
                    $('.ok span').text('Gist saved');
                    $scope.edit = false;
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
    $scope.description = '';
    $scope.isPublic = false;
    $scope.files = [
        {
            filename: '',
            content: ''
        }
    ];

    $scope.addFile = function() {
        console.log('add file');
        console.log($scope);
        $scope.files.push({
            content: '',
            filename: '',
            language: 'html'
        });
    };

    $scope.save = function($event) {

        if ($event) {
            $event.preventDefault();
        }

        var data = {
            description: $scope.description,
            "public": $scope.isPublic,
            files: {}
        };

        for (var file in $scope.files) {
            data.files[$scope.files[file].filename] = {
                content: $scope.files[file].content
            };
        }

        $http.post('http://localhost:3000/gists/create', data)
                .success(function(response) {
            if (response.status === 'ok') {
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                window.location.href = "#/gist/" + response.data.id
            }
        });
    }
}
