(function() {
    'use strict';

    angular.module('gisto')
        .controller('YesNoController', ['$scope', 'close', YesNoController]);

    function YesNoController($scope, close) {
        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
    }

})();