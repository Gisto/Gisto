'use strict';

angular.module('gisto.filter.encodeUrl', []).filter('encodeUrl', function () {
    return function (input) {
        console.log(input, encodeURIComponent(input));
        return encodeURIComponent(input);
    };
});