'use strict';

angular.module('gisto.filter.markDown', []).filter('markDown', function ($compile, $rootScope) {
    return function (input) {
        if (typeof input === 'undefined') {
            return;
        } else {
            var converter = new Showdown.converter();
            var html = converter.makeHtml(input);
            html = html.replace(/href="(.*)"/gi, function (match, p1) {
                return 'onclick="gui.Shell.openExternal(\'' + p1 + '\')"';
            });
            return html;
        }
    };
})