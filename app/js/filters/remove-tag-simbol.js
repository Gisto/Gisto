'use strict';

angular.module('gisto.filter.removeTagSymbol', []).filter('removeTagSymbol', function () {
        return function (input) {
            return input.substring(1, input.length);
        };
    });