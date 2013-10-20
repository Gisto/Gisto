'use strict';

angular.module('gisto.filter.markDown', []).filter('markDown', function () {
    return function (input) {
        if (typeof input === 'undefined') {
            return;
        } else {
            var converter = new Showdown.converter();
            var html = converter.makeHtml(input);
            return html;
        }
    };
})