'use strict';

angular.module('gisto.directive.editor', []).directive('editor', ['$timeout', 'appSettings', function ($timeout, appSettings) {
    return {
        restrict: 'E',
        template: '<div ng-if="showmd" class="special-editor-markdown" ng-bind-html="file.content | markDown"></div>' +
        '<pre id="editor-{{$index}}" class="editor">{{file.content}}</pre>',
        link: function ($scope, $element, $attrs) {
            $scope.showmd = false;
            if ($attrs.language === 'markdown') {
                $scope.showmd = true;
            }


            appSettings.loadSettings().then(function (appSettingsResult) {

                $timeout(function () {

                    var lang = $attrs.language,
                        font = parseInt(appSettingsResult.font_size),
                        indexed = $attrs.index,
                        editor = ace.edit($element.find('.editor')[0]),
                        session = editor.getSession(),
                        theme = $attrs.theme,
                        inUpdateProcess = false;

                    // Emmet
                    if (lang === 'html' && appSettingsResult.editor_ext.emmet) {
                        console.log('Emmet should be loaded');
                        ace.require("ace/ext/emmet");
                        editor.setOptions({
                            enableEmmet: true
                        });
                    } else {
                        editor.setOptions({
                            enableEmmet: false
                        });
                    }

                    // Auto-completion
                    if (appSettingsResult.editor_ext.emmet) {
                        console.log('language tools should be loaded');
                        ace.require("ace/ext/language_tools");
                        editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableSnippets: true
                        });
                    }
                    // Status bar
                    if (appSettingsResult.editor_ext.statusbar) {
                        var statusBarElement = angular.element('<div><i class="icon-info-sign"></i> </div>');
                        $element.append(statusBarElement);
                        var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
                        new StatusBar(editor, statusBarElement[0]);
                    }

                    // VIM mode
                    if(appSettingsResult.editor_vim_mode) {
                        editor.setKeyboardHandler("ace/keyboard/vim");
                    }

                    // word wrap
                    if(appSettingsResult.editor_word_wrap) {
                        editor.getSession().setUseWrapMode(true);
                    }

                    editor.setTheme("ace/theme/" + theme);
                    editor.getSession().setMode("ace/mode/" + lang);
                    editor.getSession().setTabSize( parseInt(appSettingsResult.editor_tab_size) );
                    editor.setFontSize(font);
                    editor.setShowPrintMargin(false);
                    editor.renderer.setShowGutter(true);
                    editor.setAutoScrollEditorIntoView(true);
                    var maxLinesSettings = appSettingsResult.max_lines.toString();
                    var minLinesSettings = (appSettingsResult.min_lines !== 0) ? appSettingsResult.min_lines.toString() : editor.session.getLength().toString();
                    editor.setOption("maxLines", maxLinesSettings);
                    editor.setOption("minLines", minLinesSettings);
                    editor.resize(true);

                    console.log('language:', lang);
                    console.log('tab size:', lang);
                    console.log('Theme:', theme);
                    console.log('Font size:', font);
                    console.log('renderer.lineHeight', editor.renderer.lineHeight);
                    console.log('# of LINES', editor.session.getLength());
                    console.log('max_lines', appSettingsResult.max_lines);
                    console.log('min_lines', appSettingsResult.min_lines);


                    editor.on('paste', function(text) {
                        // delay the change event to the end of the call stack
                        // and fire a change event with an extra parameter indicating
                        // that this is a paste event and continue to update the reference
                        // to angular file model.
                        $timeout(function() {
                            editor._emit('change', {target: editor, pasteEvent: true});
                        },0);

                    });

                    editor.on('change', function (data) {

                        // change coming from manually changing the value using the api
                        // skip the update
                        if (inUpdateProcess) {
                            return;
                        }

                        // only react to user actions
                        if (data.pasteEvent || editor.curOp && editor.curOp.command.name) {
                            $scope.$apply(function () {
                                $scope.file.content = editor.getValue();
                                if (!$scope.edit) {
                                    $scope.enableEdit();
                                }
                            });
                        }
                    });

                    // listen to ngModel render and update the session
                    $scope.$on('ace-update', function (e, updatedFile) {
                        if ($scope.file.filename === updatedFile) {
                            inUpdateProcess = true;
                            session.setValue($scope.file.content);
                            inUpdateProcess = false;
                        }
                    });


                }, 0);
            });
        }

    };
}]);