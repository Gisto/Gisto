'use strict';

function singleGistCtrl($scope, $routeParams, gistData, ghAPI, $rootScope, notificationService, appSettings) {

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

    $scope.share = function () {
        if ($scope.userToShare) {
            notificationService.send('sendNotification', { recipient: $scope.userToShare, gistId: $scope.gist.id, name: $scope.gist.description, gravatar_id: appSettings.get('gravatar_id')});
            console.log('sent notification!');
        } else {
            $('.warn').slideDown('slow');
            $('.warn span').text('User is empty');
            setTimeout(function () {
                $('.warn').slideUp();
            }, 2500);
        }

    };

    $scope.copyToClipboard = function (data, message, type) {
        message = message || 'Content of a file <b>' + data.filename + '</b> copied to clipboard';
        if (clipboard !== undefined) {
            if (type === 'embed') {
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

    $scope.enableEdit = function (old_obj, old_description) {
        $scope.old_object = angular.copy(old_obj);
        $scope.old_description = old_description;

        $rootScope.edit = true;
        $('.edit').slideDown('slow');
    };
    $scope.disableEdit = function () {
        console.log($scope.gist);
        $rootScope.edit = false;

        // copy back the original content
        $scope.gist.description = $scope.gist.single._original.description;
        $scope.gist.single.description = $scope.gist.single._original.description;
        $scope.gist.single.files = angular.copy($scope.gist.single._original.files);
        $('.edit').slideUp('slow');
    };

    $scope.warnDeleteGist = function () {
        $('.delete').slideDown('slow');
    };

    $scope.cancelDeleteGist = function () {
        $('.delete').slideUp('slow');
    };

    $scope.deleteFileConfirm = function (filename) {
        $scope.fileToDelete = filename;
        $('.delete-file').slideDown('slow');
    };

    $scope.cancelDeleteFile = function () {
        $('.delete-file').slideUp('slow');
    };

    $scope.warnStateChange = function ($state) {
        $scope.state = $state;
        $('.state').slideDown('slow');
    };

    $scope.cancelStateChange = function () {
        $('.state').slideUp('slow');
    };

    $scope.$on('serverFailure', function () {
        console.log('server failure');
        $('.notification-error').slideDown('slow');

        setTimeout(function () {
            $('.notification-error').slideUp('slow');
        }, 3000);
    });

    $scope.changeState = function ($state, event) {
        var the_state;
        if ($state === 'public') {
            the_state = true;
        } else {
            the_state = false;
        }

        var data = {
            description: $scope.gist.single.description,
            "public": the_state,
            files: {}
        };

        for (var file in $scope.gist.single.files) {
            data.files[$scope.gist.single.files[file].filename] = {
                content: $scope.gist.single.files[file].content
            };
        }

        ghAPI.create(data, function (response) {
            if (response.status === 201) {

                $('.ok').slideDown('slow');
                $('.ok span').text('Gist set to ' + $state);

                var newGist = {
                    id: response.data.id,
                    description: response.data.description,
                    "public": response.data.public,
                    files: {}
                };

                // Remove the old gist
                ghAPI.delete($scope.gist.single.id);
                gistData.list.splice(gistData.list.indexOf(gistData.getGistById($scope.gist.single.id)), 1);

                newGist.tags = newGist.description ? newGist.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                newGist.files = response.data.files;
                newGist.comments = 0;
                newGist.filesCount = Object.keys(newGist.files).length;
                newGist.history = response.data.history;
                gistData.list.unshift(newGist);
                setTimeout(function () {
                    $('.ok').slideUp();
                }, 2500);
                window.location.href = "#/gist/" + response.data.id;
            }
        });


    }

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
        console.log('delete activated', $scope);
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
        $('.drop').slideDown('slow');
        $('.main section').addClass('dragarea');
        $('.drop span').text('Drag detected - now drop!');
        console.log('dragging start');
    };


    $scope.drop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var data = event.dataTransfer;
        for (var i = 0; i < data.files.length; i++) { // For each dropped file or directory

            $('.edit').slideUp('slow');
            $('.ok').slideDown('slow');

            $('.main section').removeClass('dragarea');

            var entry = data.items[i].webkitGetAsEntry(); // get file system entries

            if (entry.isFile) {
                addFileToScope(data.files[i]); // add the file to the gist scope
                $('.ok span').html('Dropped: <b>' + entry.name + '</b>');

            } else if (entry.isDirectory) {
                $('.ok span').html('Dropped Directory: <b>' + entry.name + '</b>');

                var reader = function readDirectory(entry) {

                    var directoryReader = entry.createReader();

                    directoryReader.readEntries(function (results) {
                        if (results.length) {
                            angular.forEach(results, function (resultEntry) {

                                if (resultEntry.isFile) {
                                    if (resultEntry.name === '.DS_Store') {
                                        return; // skip osx meta data fle
                                    }

                                    resultEntry.file(function (file) {
                                        addFileToScope(file);
                                    });
                                } else {
                                    // another directory call self with the new directory
                                    readDirectory(resultEntry);
                                }
                            });
                        }
                    });
                }(entry); //self execute for the first time
            }
            $rootScope.$apply(function() {
                $('.ok,.drop').slideUp('slow');
                $rootScope.edit = true;
                $('.edit').slideDown('slow');
            });

        }
    };

    function addFileToScope(file) {
        var fileReader = new FileReader();

        fileReader.onloadend = (function (filename) {
            return function (event) {
                $scope.$apply(function () {
                    $scope.gist.single.files[filename] = {
                        filename: filename,
                        content: event.target.result,
                        language: 'html'
                    }
                });
            };
        })(file.name);

        fileReader.readAsText(file);
    }

    $scope.dragEnd = function (e) {
        e.stopPropagation();
        e.preventDefault();
        //$('.ok').slideUp('slow');
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
                $('.delete-file').slideUp();
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
            data.files[$scope.gist.single.files[file].filename] = {
                content: $scope.gist.single.files[file].content,
                filename: $scope.gist.single.files[file].filename
            };
        }

        console.log('data', $scope.gist.single);

        if (angular.equals($scope.old_object, $scope.gist.single.files) && angular.equals($scope.old_description, $scope.gist.description)) {
            $('.warn.template span').text('No changes to save.');
            $('.warn.template').slideDown('slow');
            $rootScope.edit = false;
            setTimeout(function () {
                $('.warn.template').slideUp();
            }, 2500);
        } else {

            /*
             ** keep a backup incase something goes wrong - this is done to prevent a delay between
             ** when the api call finishes and when the real original content is saved.
             ** if a gist is saved and edited again quickly before the request completes the original
             ** text would be wrong
             */
            var originalBackup = angular.copy($scope.gist.single._original);

            // update the original backup to match the current changes
            $scope.gist.single._original.files = $scope.gist.single.files;
            $scope.gist.single._original.description = $scope.gist.single.description;

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
                    // revert back to the original backup
                    $scope.gist.single._original = originalBackup;

                    console.log(response);
                    $('.warn').slideDown('slow');
                    $('.warn span').text('You cannot save empty files');
                    setTimeout(function () {
                        $('.warn').slideUp();
                    }, 2500);
                } else {
                    // revert back to the original backup
                    $scope.gist.single._original = originalBackup;

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