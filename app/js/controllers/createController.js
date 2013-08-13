'use strict';

function createGistCtrl($scope,$rootScope, ghAPI, gistData) {
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

    $scope.enableEdit = function () {
        $rootScope.edit = true;
        $('.edit').slideDown('slow');
    };
    $scope.disableEdit = function () {
        $rootScope.edit = false;
        $('.edit').slideUp('slow');
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