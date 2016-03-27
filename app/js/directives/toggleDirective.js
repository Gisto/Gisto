'use strict';

angular.module('gisto.directive.toggle', []).directive('toggle', function () {
    return {
        restrict: "E",
        template: '<label><input type="checkbox" data-ng-model="ngModel" class="ios-switch tinyswitch" /><div><div></div></div> <span ng-bind-html="text"></span></label>',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs) {
            scope.text = attrs.text;
        }
    }
});
