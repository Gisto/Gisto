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