'use strict';

angular.module('gisto.filter.githubFileName', []).filter('githubFileName', function () {
    return function (input) {
        if(input.charAt(0) === '.') {
            input = input.substr(1);
        }
        return input.replace(/\.|\s/g,'-').toLowerCase();
    };
});