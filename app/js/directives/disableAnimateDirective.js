'use strict';

angular.module('gisto.directive.disableAnimate', ['ngAnimate']).directive('disableAnimate', function ($animate) {
    return function($scope, $element) {
        console.log('disable animate', $scope, $element, $animate);
        $animate.enabled(false, $element);
    }
});