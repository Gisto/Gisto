(function() {
    'use strict';

    angular.module('gisto')
        .controller('footerCtrl', footerCtrl);

    function footerCtrl($scope) {
        $scope.theDate = Date.now();
    }

})();