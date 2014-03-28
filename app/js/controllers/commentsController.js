'use strict';

function commentsGistCtrl($scope, $routeParams, ghAPI) {
        $scope.comments = [];
        ghAPI.comments($routeParams.gistId, function (response) {
            if (response.status === 200) {
                $scope.comments.push.apply($scope.comments, response.data);
            } else {
                console.warn('[!!!] >>> Comments not loaded - server responded with error.');
            }
        });

    $scope.add_comment = function(data){
        console.log('COMMENT BODY',data);
        var comment = {
            "body": data
        };
        ghAPI.add_comment($routeParams.gistId, comment, function (response) {
            if (response.status === 201) {
                $scope.comments.push(response.data);
                $scope.gist.comments = $scope.gist.comments + 1;
                angular.element(document.querySelector('.comment-text')).val('');
                angular.element(document.querySelector('.show-preview')).html('');
            } else {
                console.warn('[!!!] >>> Comment not posted - server responded with error.');
            }
        });
    };

    $scope.delete_comment = function(gist_id,comment_id,$index) {
        ghAPI.delete_comment(gist_id, comment_id, function (response) {
            if (response.status === 204) {
                $scope.gist.comments = $scope.gist.comments - 1;
                $scope.comments.splice($index,1);
                console.log('DELETED COMMENT','#' + comment_id + ' from gist #' + gist_id);
            } else {
                console.warn('[!!!] >>> Comment not posted - server responded with error.');
            }
        });
    };

}