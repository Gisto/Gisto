(function() {
    'use strict';

    angular.module('gisto')
        .controller('YesNoController', ['$scope', 'title', 'description', 'close', YesNoController]);

    function YesNoController($scope, title, description, close) {
        $scope.title = title;
        $scope.description = description;

        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
    }

})();