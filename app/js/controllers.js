'use strict';
/* Controllers */

function listGistCtrl($scope, $http, db, ghAPI) {
    /*
     db.set('gisto_auth', {token: ''}, function(response) {
     if (response.status === 'ok') {
     console.log('OK');
     } else {
     console.log('NADA!!!');
     }
     });

     db.get('gisto_auth', function(response) {
     console.log(response.data.token);
     });
     */
    var data = ghAPI.gists(); // Get the gists list
    for (var item in data) {
        data[item].tags = data[item].description ? data[item].description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
    }
    $scope.gists = data;
}

function singleGistCtrl($scope, $routeParams, $http, db, ghAPI) {
    var data = ghAPI.gist($routeParams.gistId);
    $scope.single = data;
    $scope.tags = data.description ? data.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];

    $scope.enableEdit = function() {
        $scope.edit = true;
        $('.edit').slideDown('slow');
    };
    $scope.disableEdit = function() {
        $scope.edit = false;
    };

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
        var response = ghAPI.delete($scope.single.id);
        if (response === 'ok') {
            console.log(response);
            $('.warn').slideDown('slow');
            $('.warn span').text('Gist deleted');
            setTimeout(function() {
                $('.warn').slideUp();
            }, 2500);
        }
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

        var response = ghAPI.edit(data);
        if (response.status === 'ok') {
            $('.ok').slideDown('slow');
            $('.ok span').text('Gist saved');
            $scope.edit = false;
            $scope.single.history = response.data.history;
            setTimeout(function() {
                $('.ok').slideUp();
            }, 2500);
        }
    };

}

function commentsGistCtrl($scope, $routeParams, $http) {
    $http.get('http://localhost:3000/gists/comments/' + $routeParams.gistId)
            .success(function(data) {
        $scope.comments = data;
    });
}

function createGistCtrl($scope, $routeParams, $http, ghAPI) {
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

        var response = ghAPI.create(data);
        if (response === 'OK') {
            $('.ok').slideDown('slow');
            $('.ok span').text('Gist saved');
            window.location.href = "#/gist/" + response.data.id;
        }
    }
}
