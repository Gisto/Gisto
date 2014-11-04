'use strict';

angular.module('gisto.filter.removeTags', []).filter('removeTags', function () {
        return function (input) {
            return input ? input.replace(/#\S+/g, '') : input;
        };
    });