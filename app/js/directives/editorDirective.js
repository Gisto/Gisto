'use strict';

angular.module('gisto.directive.editor', []).directive('editor', ['$timeout','appSettings',function ($timeout,appSettings) {
    var editorWindow = angular.element('<pre id="editor-{{$index}}">{{file.content}}</pre><div data-ng-if="editor_ext.statusbar" id="statusBar-{{$index}}"><i class="icon-info-sign"></i> </div>');
    return {
        restrict: 'E',
        compile: function (elem) {
            elem.append(editorWindow);

            return function (scope, element, attrs) {

                appSettings.loadSettings().then(function(appSettingsResult) {

                $timeout(function () {

                    var lang = attrs.language,
                        font = +attrs.font,
                        indexed = attrs.index,
                        editor = ace.edit('editor-' + attrs.index),
                        theme = attrs.theme;

                    // Emmet
                    if(lang === 'html' && appSettingsResult.editor_ext.emmet) {
                        console.log('Emmet should be loaded');
                        ace.require("ace/ext/emmet");
                        editor.setOptions({
                            enableEmmet: true
                        });
                    }
                    // Auto-completion
                    if(lang === 'html' && appSettingsResult.editor_ext.emmet) {
                        console.log('language tools should be loaded');
                        ace.require("ace/ext/language_tools");
                        editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableSnippets: true
                        });
                    }
                    // Status bar
                    if(appSettingsResult.editor_ext.statusbar) {
                        var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
                        var statusBar = new StatusBar(editor, document.getElementById('statusBar-'+attrs.index));
                    }

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
                });
            };
        }

    };
}]);