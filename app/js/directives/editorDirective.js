'use strict';

angular.module('gisto.directive.editor', []).directive('editor', function ($timeout) {
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
                    editor.renderer.setShowGutter(true);
                    editor.setAutoScrollEditorIntoView(true);
                    editor.setOptions({
                        maxLines: 20
                    });
                    editor.resize(true);

                    console.log('language:', lang);
                    console.log('Theme:', theme);
                    console.log('Font size:', font);
                    console.log('renderer.lineHeight',editor.renderer.lineHeight);

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