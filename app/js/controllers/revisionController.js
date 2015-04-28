(function() {
    'use strict';

    angular.module('gisto')
        .controller('singleGistHistoryCtrl', ['$scope', '$routeParams', 'gistData', 'ghAPI',
            '$filter', 'githubUrlBuilderService', singleGistHistoryCtrl]);

    function singleGistHistoryCtrl($scope, $routeParams, gistData, ghAPI, $filter, githubUrlBuilderService) {
        $scope.gist = gistData.getGistById($routeParams.gistId);
        $scope.version_hash = $routeParams.gistRevisionId;

        var githubFileName = $filter('githubFileName');

        ghAPI.history($routeParams.gistId, $routeParams.gistRevisionId);

        $scope.buildHistoryLink = githubUrlBuilderService.buildHistoryLink;

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
    }

})();