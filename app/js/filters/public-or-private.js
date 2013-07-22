'use strict';

angular.module('gisto.filter.publicOrPrivet', []).filter('publicOrPrivet', function () {
        return function (input) {
            return input ? 'unlock' : 'lock';
        };
    });