'use strict';

angular.module('gisto.filter.truncate', []).filter('truncate', function () {
        return function (text, length, end) {

            if (!text) {
                return '';
            }
            if (isNaN(length)) {
                length = 10;
            }
            if (end === undefined) {
                end = "...";
            }
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length - end.length) + end;
            }

        };
    });