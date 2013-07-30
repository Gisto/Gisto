'use strict';

angular.module('gisto.filter.removeTags', []).filter('removeTags', function () {
        return function (input) {
            return input ? input.replace(/(#[A-Za-z0-9\-\_]+)/g, '') : input;
        };
    });