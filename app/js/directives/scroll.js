'use strict';

angular.module('gisto.directive.scrollTo', []).directive("scrollTo", ["$window", function ($window) {
    // http://ngmodules.org/modules/ngScrollTo
    // This directive is currently for files dropdown only
    // TODO: rewrite to be as single directive.
    return {
        restrict: "AC",
        compile: function () {

            var document = $window.document;

            function scrollInto(idOrName) {
                if (!idOrName)
                    $window.scrollTo(0, 0);
                var el = document.getElementById(idOrName);
                if (!el) {
                    el = document.getElementsByName(idOrName);

                    if (el && el.length)
                        el = el[0];
                    else
                        el = null;
                }

                if (el) {
                    el.scrollIntoView();
                }
            }

            return function (scope, element, attr) {
                element.bind("click", function (event) {
                    scrollInto(attr.scrollTo);
                });
            };
        }
    };
}]);