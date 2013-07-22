'use strict';

function singleGistCtrl($scope, $routeParams, gistData, ghAPI, $rootScope) {

    $scope.gist = gistData.getGistById($routeParams.gistId);

    if ($scope.gist.hasOwnProperty('single') && $scope.gist.single.hasOwnProperty('lastUpdated')) {
        console.log($scope.gist.single.lastUpdated);
        var now = new Date();
        var seconds = Math.round((now.getTime() - $scope.gist.single.lastUpdated.getTime()) / 1000);
        console.log(seconds + ' have passed since last updated');
        if (seconds > 60) {
            ghAPI.gist($routeParams.gistId);
        }
    } else {
        ghAPI.gist($routeParams.gistId);
    }

    $scope.copyToClipboard = function (data, message,type) {
        message = message || 'Content of a file <b>' + data.filename + '</b> copied to clipboard';
        if (clipboard !== undefined) {
            if(type === 'embed') {
                clipboard.set('<script src="' + data + '"></script>');
            } else {
                clipboard.set(data.content || data, 'text');
            }
        } else {
            // Copy to clipboard really only works in App
            console.warn('>>> DEBUG MODE ON | Copy to clipboard really only works in App \n Data: ' + (data.content || data));
            console.log('data:', data);
        }

        $('.ok').slideDown('slow');
        $('.ok span').html(message);
        setTimeout(function () {
            $('.ok').slideUp();
        }, 2500);
    };

    $scope.gotoSite = function (user, id, file) {
        console.log('url', 'https://gist.github.com/' + user + '/' + id + '/#file-' + file.replace(/[.]/gi, '-'));
        gui.Shell.openExternal('https://gist.github.com/' + user + '/' + id + '/#file-' + file.replace(/[.]/gi, '-'));
    };

    $scope.enableEdit = function (old_obj,old_description) {
        $scope.old_object = angular.copy(old_obj);
        $scope.old_description = old_description;

        $rootScope.edit = true;
        $('.edit').slideDown('slow');
    };
    $scope.disableEdit = function () {
        $rootScope.edit = false;
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
                $scope.gist.has_star = true;
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
                $scope.gist.has_star = false;
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
                gistData.list.splice(gistData.list.indexOf(gistData.getGistById($scope.gist.single.id)), 1);
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
        $scope.enableEdit();
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
            $rootScope.edit = true;
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

    $scope.deleteFile = function (file_name) {
        console.log('delete file', file_name);
        $('.loading span').html('Deleting file <b>' + file_name + '</b>');

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
        // Remove single file from gist array
        data.files[file_name] = null;
        delete $scope.gist.single.files[file_name];

        ghAPI.edit($scope.gist.single.id, data, function (response) {
            if (response.status === 200) {
                $('.ok').slideDown('slow');
                $('.ok span').html('File ' + file_name + ' removed');
                $rootScope.edit = false;
                //$scope.gist.single.files = response.data.files;
                $scope.gist.single.history = response.data.history;
                $scope.gist.filesCount = Object.keys($scope.gist.single.files).length;

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

    $scope.update = function () {
        $('.loading span').text('Saving...');
        $('.edit').slideUp();

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

        if( angular.equals($scope.old_object, $scope.gist.single.files) && angular.equals($scope.old_description, $scope.gist.description) ) {
            $('.warn').slideDown('slow');
            $('.warn span').text('No changes to save.');
            $rootScope.edit = false;
            setTimeout(function () {
                $('.warn').slideUp();
            }, 2500);
        } else {
            ghAPI.edit($scope.gist.single.id, data, function (response) {
                if (response.status === 200) {
                    $('.ok').slideDown('slow');
                    $('.ok span').text('Gist saved');
                    $rootScope.edit = false;
                    $scope.gist.single.files = response.data.files;
                    $scope.gist.single.history = response.data.history;
                    $scope.gist.tags = $scope.gist.description ? $scope.gist.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                    $scope.gist.filesCount = Object.keys($scope.gist.single.files).length;

                    setTimeout(function () {
                        $('.ok').slideUp();
                    }, 2500);
                } else if (response.status === 422) { // ststus code of: 422 (Unprocessable Entity)
                    $('.warn').slideDown('slow');
                    $('.warn span').text('You cannot save empty files');
                    setTimeout(function () {
                        $('.warn').slideUp();
                    }, 2500);
                } else {
                    $('.warn').slideDown('slow');
                    $('.warn span').text('Something went wrong');
                    setTimeout(function () {
                        $('.warn').slideUp();
                    }, 2500);
                }
            });
        }
    };
}