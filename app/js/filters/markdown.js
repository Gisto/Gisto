'use strict';

angular.module('gisto.filter.markDown', []).filter('markDown', function () {
        return function (input) {
            var converter = new Showdown.converter();
            var html = converter.makeHtml(input);
            return html;
        };
    })