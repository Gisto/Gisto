'use strict';

angular.module('gisto.filter.markDown', ['hc.marked']).filter('markDown', function ($sce, marked) {
    return function (input) {
        if (typeof input === 'undefined') {
            return;
        } else {
            var html = marked(input);
            html = html.replace(/href="(.*)"/gi, function (match, p1) {
                return 'onclick="gui.Shell.openExternal(\'' + p1 + '\')"';
            });
            return $sce.trustAsHtml(html);
        }
    };
})