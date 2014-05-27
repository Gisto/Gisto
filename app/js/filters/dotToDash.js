'use strict';

angular.module('gisto.filter.dotToDash', []).filter('dotToDash', function () {
    return function (input) {
        var output = input;
        if(input.charAt(0) === '.') {
            output = input.substr(1);
        }
        return output.replace('.','-');
    };
});