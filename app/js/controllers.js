'use strict';
/* Controllers */

function settingsCtrl($scope, appSettings) {
    $scope.themes = appSettings.theme_list;
    $scope.editor_themes = appSettings.editor_theme_list;

    $scope.theme = appSettings.get('theme') || 'default';
    $scope.editor_theme = appSettings.get('editor_theme') || 'tomorrow';
    $scope.token = appSettings.get('token') || '';
    $scope.avatar = appSettings.get('avatar') || '';
    $scope.update_settings = function () {
        var data = {};
        data.theme = $scope.theme;
        data.editor_theme = $scope.editor_theme;
        data.token = appSettings.get('token');
        data.avatar = appSettings.get('avatar');
        var saved = appSettings.set(data, function (response) {
            if (response.status === 'ok') {
                console.log('SAVED SETTINGS');
                window.location.reload();
            } else {
                console.log('NOT SAVED SETTINGS');
            }
        });

    };
}

function viewCtrl($scope) {
    $scope.avatar = 'https://secure.gravatar.com/avatar/' + JSON.parse(localStorage.settings).avatar;
}

function loginCtrl($scope, ghAPI, appSettings) {
    $scope.submit = function () {
        ghAPI.login($scope.user, $scope.pass, function (response) {
            if (response.status === 201) {
                console.log(response);
                var data = {};
                data.token = response.data.token;
                ghAPI.setToken(response.data.token);
                data.theme = appSettings.get('default') || 'default';
                data.avatar = appSettings.get('none') || 'none';
                data.editor_theme = appSettings.get('tomorrow') || 'tomorrow';
                localStorage.settings = JSON.stringify(data);
                window.location.href = '#/';
            } else {
                console.warn('[!!!] >>> Log-in failed - server responded with error.');
                $('.warn').slideDown('slow');
                $('.warn span').text('Log-in failed - server responded with error');
                setTimeout(function () {
                    $('.warn').slideUp();
                }, 2500);
            }
        });
    };
}

function logoutCtrl($scope, appSettings, gistData) {
    $scope.logOut = function () {
        gistData.list = [];
        appSettings.logOut();
    };
}

function listGistCtrl($scope, ghAPI, gistData) {
    $scope.gists = gistData.list;
    // Get the gists list
    ghAPI.gists();
}

function singleGistCtrl($scope, $routeParams, gistData, ghAPI) {

    $scope.gist = gistData.getGistById($routeParams.gistId);

    if ($scope.gist.single.hasOwnProperty('lastUpdated')) {
        console.log($scope.gist.single.lastUpdated);
        var now = new Date();
        var seconds = Math.round((now.getTime() - $scope.gist.single.lastUpdated.getTime())/1000);
        console.log(seconds + ' have passed since last updated');
       if (seconds > 60) {
           ghAPI.gist($routeParams.gistId);
       }

    } else {
        ghAPI.gist($routeParams.gistId);
    }


    //console.log('>>>>>>>>>>>>>>>>>>>>>> scope gist');
    //console.log();

    $scope.copyToClipboard = function (file) {
        if (clipboard !== undefined) {
            clipboard.set(file.content, 'text');
        } else {
            console.log('>>> DEBUG MOD ON | Copy to clipboard really only works in App \n File name: ' + file.filename + '\n Content: \n' + file.content);
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

    $scope.star = function ($event) {
        if ($event) {
            $event.preventDefault();
        }
        ghAPI.star($scope.gist.single.id, function (response) {
            if (response.status === 204) {
                console.log(response);
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist starred');
                $('.star').removeClass('icon-star-empty').addClass('icon-star');
                $scope.gist.single.starred = !$scope.gist.single.starred;
                setTimeout(function () {
                    $('.ok').slideUp();
                }, 2500);
            } else {
                console.log(response);
                $('.warn').slideDown('slow');
                $('.warn span').text('Gist not starred, something went wrong');
                setTimeout(function () {
                    $('.warn').slideUp();
                }, 2500);
            }
        });
    };

    $scope.unstar = function ($event) {
        if ($event) {
            $event.preventDefault();
        }
        ghAPI.unstar($scope.gist.single.id, function (response) {
            if (response.status === 204) {
                console.log(response);
                $('.ok').slideDown('slow');
                $('.ok span').text('Star removed');
                $('.star').removeClass('icon-star').addClass('icon-star-empty');
                $scope.gist.single.starred = !$scope.gist.single.starred;
                setTimeout(function () {
                    $('.ok').slideUp();
                }, 2500);
            } else {
                console.log(response);
                $('.warn').slideDown('slow');
                $('.warn span').text('Something went wrong');
                setTimeout(function () {
                    $('.warn').slideUp();
                }, 2500);
            }
        });
    };

    $scope.del = function ($event) {
        if ($event) {
            $event.preventDefault();
        }
        console.log($scope);
        ghAPI.delete($scope.gist.single.id, function (response) {
            if (response.status === 204) {
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist deleted');
                // Remove from list of gists.
                gistData.list.splice( gistData.list.indexOf(gistData.getGistById($scope.gist.single.id)), 1 );
                setTimeout(function () {
                    $('.ok').slideUp();
                    window.location.href = 'index.html#/';
                }, 1000);
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
        var fileName = 'newFile' + Object.keys($scope.gist.single.files).length + '.txt';
        $scope.gist.single.files[fileName] = {
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
                    $scope.gist.single.files[filename] = {
                        filename: filename,
                        content: event.target.result,
                        language: 'html'
                    };
                    $scope.$digest();
                };
            })(file.name);

            reader.readAsText(file);

        }
    };

    $scope.dragEnd = function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('drag end');
    };

    $scope.update = function ($event) {
        $('.loading span').text('Saving...');
        $('.edit').slideUp();
        if ($event) {
            $event.preventDefault();
        }

        var data = {
            description: $scope.gist.description,
            id: $scope.gist.id,
            files: {}
        };

        for (var file in $scope.gist.single.files) {
            data.files[file] = {
                content: $scope.gist.single.files[file].content,
                filename: $scope.gist.single.files[file].filename
            };
        }

        ghAPI.edit($scope.gist.single.id, data, function (response) {
            if (response.status === 200) {
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                $scope.edit = false;
                $scope.gist.single.files = response.data.files;
                $scope.gist.single.history = response.data.history;

                console.warn(response.data.id);

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

function createGistCtrl($scope, $routeParams, $http, ghAPI, gistData) {
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

                var newGist = {
                    id: response.data.id,
                    description: $scope.description,
                    "public": $scope.isPublic,
                    files: {}
                };

                gistData.list.unshift(newGist);


                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                window.location.href = "#/gist/" + response.data.id;
            }
        });
    };
}

function headerController($scope) {

}
