'use strict';

angular.module('gisto.filter.dotToDash', []).filter('dotToDash', function () {
    return function (input) {
        return input.replace('.','-');
    };
});