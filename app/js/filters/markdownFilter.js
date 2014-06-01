'use strict';

angular.module('gisto.filter.markDown', []).filter('markDown', function ($sce) {
    return function (input) {
        if (typeof input === 'undefined') {
            return;
        } else {
            var converter = new Showdown.converter();
            console.log('markdown converter', converter);
            var html = converter.makeHtml(input);
            return $sce.trustAsHtml(html);
        }
    };
})