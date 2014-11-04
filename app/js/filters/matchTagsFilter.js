'use strict';

angular.module('gisto.filter.matchTags', []).filter('matchTags', function () {
        return function (input) {
            return input ? input.match(/#\S+/g) : input;
        };
    });