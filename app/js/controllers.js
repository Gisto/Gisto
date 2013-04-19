'use strict';
/* Controllers */

function loginCtrl($scope, ghAPI) {
    $scope.submit = function () {
        ghAPI.login($scope.user, $scope.pass, function (response) {
            if (response.status === 201) {
                localStorage.token = response.data.token;
                window.location.reload();
            } else {
                console.warn('[!!!] >>> Log-in failed - server responded with error.');
            }
        });
    };
}

function avatarCtrl($scope) {
    $scope.avatar = localStorage.avatar;
}

function listGistCtrl($scope, $http, ghAPI) {
    // Get the gists list

    ghAPI.gists(function (response) {
        console.log(response);

        for (var item in response.data) {
            response.data[item].tags = response.data[item].description ? response.data[item].description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
        }
        if (!$scope.gists) {
            $scope.gists = response.data;
        } else {
            $scope.gists.push.apply($scope.gists, response.data);
        }

    }, true);
}

function singleGistCtrl($scope, $routeParams, $http, ghAPI) {
    ghAPI.gist($routeParams.gistId, function (response) {
        var data = response.data;
        $scope.single = data;
        $scope.tags = data.description ? data.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
    });

    $scope.copyToClipboard = function (file) {
        if (clipboard !== undefined) {
            clipboard.set(file.content, 'text');
        } else {
            console.log('>>> DEBUG MOD ON | Copy to clipboard really only works in App \n File name: ' + file.filename + '\n Content: \n' + file.content)
        }

        $('.ok').slideDown('slow');
        $('.ok span').html('Content of a file <b>' + file.filename + '</b> copied to clipboard');
        setTimeout(function () {
            $('.ok').slideUp();
        }, 2500);
    };

    $scope.enableEdit = function () {
        $scope.edit = true;
        $('.edit').slideDown('slow');
    };
    $scope.disableEdit = function () {
        $scope.edit = false;
    };

    $scope.warnDeleteGist = function () {
        $('.delete').slideDown('slow');
    };
    $scope.cancelDeleteGist = function () {
        $('.delete').slideUp('slow');
    };
    $scope.del = function ($event) {
        if ($event) {
            $event.preventDefault();
        }
        console.log($scope);
        ghAPI.delete($scope.single.id, function (response) {
            if (response.status === 204) {
                console.log(response);
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist deleted');
                setTimeout(function () {
                    $('.ok').slideUp();
                }, 2500);
            } else {
                console.log(response);
                $('.warn').slideDown('slow');
                $('.warn span').text('Gist not deleted, something went wrong');
                setTimeout(function () {
                    $('.warn').slideUp();
                }, 2500);
            }
        });
    };

    $scope.addFile = function () {
        var fileName = 'newFile' + Object.keys($scope.single.files).length + '.txt';
        $scope.single.files[fileName] = {
            content: '',
            filename: fileName,
            language: 'text'
        };
    };

    $scope.dragStart = function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('.edit').slideDown('slow');
        $('.main section').addClass('dragarea');
        $('.edit span').text('Drag detected - now drop!');
        console.log('dragging start');
    };

    $scope.drop = function (e) {
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
            reader.onloadend = (function (filename) {
                return function (event) {
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

    $scope.dragEnd = function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('drag end');
    };

    $scope.save = function ($event) {
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

        ghAPI.edit($scope.single.id, data, function (response) {
            if (response.status === 200) {
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                $scope.edit = false;
                $scope.single.history = response.data.history;
                setTimeout(function () {
                    $('.ok').slideUp();
                }, 2500);
            } else {
                $('.warn').slideDown('slow');
                $('.warn span').text('Something went wrong');
                setTimeout(function () {
                    $('.warn').slideUp();
                }, 2500);
            }
        });
    };

}

function commentsGistCtrl($scope, $routeParams, $http, ghAPI) {
    ghAPI.comments($routeParams.gistId, function (response) {
        if (response.status === 200) {
            $scope.comments = response.data;
        } else {
            console.warn('[!!!] >>> Comments not loaded - server responded with error.');
        }
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

    $scope.addFile = function () {
        console.log('add file');
        console.log($scope);
        $scope.files.push({
            content: '',
            filename: '',
            language: 'html'
        });
    };

    $scope.save = function ($event) {

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

        ghAPI.create(data, function (response) {
            if (response.status === 201) {
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                window.location.href = "#/gist/" + response.data.id;
            }
        });
    }
}
