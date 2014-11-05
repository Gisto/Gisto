'use strict';

angular.module('gisto.directive.toggle', []).directive('toggle', function () {
    return {
        restrict: "E",
        template: '<label><input type="checkbox" data-ng-model="ngModel" data-ng-class="class()" /><div><div></div></div> {{text}}</label>',
        scope: {
            ngModel: '='
        },
        replace: true,
        link: function (scope, element, attrs) {
            scope.text = attrs.text;
            scope.class = function() {
                return 'ios-switch tinyswitch';
            };
        }
    }
});