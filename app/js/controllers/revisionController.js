'use strict';

function singleGistHistoryCtrl($scope, $routeParams, gistData, ghAPI, $filter) {
    $scope.gist = gistData.getGistById($routeParams.gistId);
    $scope.version_hash = $routeParams.gistRevisionId;

    var dotToDash = $filter('dotToDash');

    ghAPI.history($routeParams.gistId,$routeParams.gistRevisionId);

    $scope.buildHistoryLink = function(gist,file) {
        return 'https://gist.github.com/' + gist.history.owner.login + '/' + gist.history.id + '/' + gist.history.history[0].version + '/#file-' + dotToDash(file.filename);
    };

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
}