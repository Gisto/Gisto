'use strict';

function createGistCtrl($scope, ghAPI, gistData) {
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
                $('.ok').slideDown('slow');
                $('.ok span').text('Gist saved');
                gistData.list.unshift(newGist);

                window.location.href = "#/gist/" + response.data.id;
            }
        });
    };
}