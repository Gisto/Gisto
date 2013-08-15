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
        $scope.files.splice(index,1);
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
                    $scope.files.push({
                        filename: filename,
                        content: event.target.result,
                        language: 'html'
                    });
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