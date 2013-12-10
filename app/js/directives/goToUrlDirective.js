'use strict';

angular.module('gisto.directive.toUrl', []).directive('toUrl', function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.on('click', function (event) {
                console.log('--------- EXTERNAL URL:', attrs.toUrl.toLowerCase());
                gui.Shell.openExternal(attrs.toUrl.toLowerCase());
            });
        }
    }
});