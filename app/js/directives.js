'use strict';

/* Directives */

var app = angular.module('myApp.directives', []);


app.directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]);

app.directive('editor', function($timeout) {
    var editorWindow = angular.element('<pre id="editor-{{$index}}">{{file.content}}</pre>');
    return {
        restrict: 'E',
        compile: function(elem) {
            elem.append(editorWindow);

            return function(scope, element, attrs) {

                $timeout(function() {

                    var lang = attrs.language,
                            editor = ace.edit('editor-' + attrs.index);

                    console.log({language: lang});

                    editor.setTheme("ace/theme/tomorrow");
                    editor.getSession().setMode("ace/mode/" + lang);

                    editor.on('change', function(data) {
                        scope.file.content = editor.getValue();
                    });

                }, 0);
            }
        }

    };
});

app.directive('unfocus', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attribs) {

            element[0].focus();

            element.bind("blur", function() {
                scope.$apply(attribs["unfocus"]);
                console.log("??");
            });

        }

    };
});

//
//
//    return function(scope, element, attrs) {
//        $timeout(function() {
//            var lang = attrs.editor;
//            var editor = ace.edit(element[0]);
//            editor.setTheme("ace/theme/tomorrow");
//            editor.getSession().setMode("ace/mode/" + lang);
//
//            editor.on('change', function(data) {
//               console.log(editor.getValue());
//
//            });
//
//        }, 0);
//    };
//});