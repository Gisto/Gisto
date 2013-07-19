'use strict';

/* Directives */

var app = angular.module('gisto.directives', []);


app.directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);

app.directive('editor', function ($timeout) {
    var editorWindow = angular.element('<pre id="editor-{{$index}}">{{file.content}}</pre>');
    return {
        restrict: 'E',
        compile: function (elem) {
            elem.append(editorWindow);

            return function (scope, element, attrs) {

                $timeout(function () {

                    var lang = attrs.language,
                        font = +attrs.font,
                        editor = ace.edit('editor-' + attrs.index),
                        theme = attrs.theme;


                    editor.setTheme("ace/theme/" + theme);
                    editor.getSession().setMode("ace/mode/" + lang);
                    editor.setFontSize(font);
                    editor.setShowPrintMargin(false);
                    editor.setAutoScrollEditorIntoView(true);

                    console.log('language:', lang);
                    console.log('Theme:', theme);
                    console.log('Font size:', font);

                    editor.on('change', function (data) {

                        scope.$apply(function () {
                            scope.file.content = editor.getValue();
                            if (!scope.edit) {
                                scope.enableEdit();
                            }
                        });
                    });

                }, 0);
            };
        }

    };
});

app.directive("scrollTo", ["$window", function ($window) {
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