'use strict';

function createGistCtrl($scope, $rootScope, ghAPI, gistData) {

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

    $scope.deleteFile = function (index) {
        $scope.files.splice(index, 1);
    };

    $scope.enableEdit = function () {
        $rootScope.edit = true;
        $('.edit').slideDown('slow');
    };
    $scope.disableEdit = function () {
        $rootScope.edit = false;
        $('.edit').slideUp('slow');
    };

    $scope.dragStart = function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('.drop').slideDown('slow');
        $('.main section').addClass('dragarea');
        console.log('dragging start');
    };

    function addFileToScope(file) {
        var fileReader = new FileReader();

        fileReader.onloadend = (function (filename) {
            return function (event) {
                $scope.$apply(function () {
                    $scope.files.push({
                        filename: filename,
                        content: event.target.result,
                        language: 'html'
                    });
                });
            };
        })(file.name);

        fileReader.readAsText(file);
    }

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
                $('.drop').slideUp('slow');
                $rootScope.edit = true;
                $('.edit').slideDown('slow');
            });

        }
    };

    $scope.dragEnd = function (e) {
        e.stopPropagation();
        e.preventDefault();
        //$('.ok').slideUp('slow');
        console.log('drag end');
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
                $rootScope.edit = false;
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                newGist.tags = $scope.description ? $scope.description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                gistData.list.unshift(newGist);

                window.location.href = "#/gist/" + response.data.id;
            }
        });
    };
}