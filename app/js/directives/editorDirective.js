'use strict';

angular.module('gisto.directive.editor', []).directive('editor', ['$timeout', 'appSettings', function ($timeout, appSettings) {
    return {
        restrict: 'E',
        template: '<div ng-if="showmd" class="special-editor-markdown" ng-bind-html-unsafe="file.content | markDown"></div>' +
        '<pre id="editor-{{$index}}">{{file.content}}</pre>' +
        '<div data-ng-if="editor_ext.statusbar" id="statusBar-{{$index}}"><i class="icon-info-sign"></i> </div>',
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
                        editor = ace.edit('editor-' + $attrs.index),
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
                        var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
                        var statusBar = new StatusBar(editor, document.getElementById('statusBar-' + $attrs.index));
                    }

                    editor.setTheme("ace/theme/" + theme);
                    editor.getSession().setMode("ace/mode/" + lang);
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
                    console.log('Theme:', theme);
                    console.log('Font size:', font);
                    console.log('renderer.lineHeight', editor.renderer.lineHeight);
                    console.log('# of LINES', editor.session.getLength());
                    console.log('max_lines', appSettingsResult.max_lines);
                    console.log('min_lines', appSettingsResult.min_lines);

                    editor.on('change', function (data) {

                        // change coming from manually changing the value using the api
                        // skip the update
                        if (inUpdateProcess) {
                            return;
                        }

                        $scope.$apply(function () {
                            $scope.file.content = editor.getValue();
                            if (!$scope.edit) {
                                $scope.enableEdit();
                            }
                        });
                    });

                    // listen to ngModel render and update the session
                    $scope.$on('ace-update', function(e, updatedFile) {
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