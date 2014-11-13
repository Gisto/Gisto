'use strict';

angular.module('gisto.directive.resourceLoader', []).directive('resourceLoader', ['appSettings', '$rootScope', function (appSettings, $rootScope) {

    var headerTemplate = '<link rel="stylesheet" href="themes/{{theme}}/theme.css" /><link rel="stylesheet" href="css/animation.css" ng-if="animation"/>';
    var footerTemplate = '<script data-ng-if="editor_ext.emmet" src="lib/ace-builds/src-min-noconflict/ext-emmet.js"></script>'+
        '<script data-ng-if="editor_ext.statusbar" src="lib/ace-builds/src-min-noconflict/ext-statusbar.js"></script>'+
        '<script data-ng-if="editor_ext.autocompletion" src="lib/ace-builds/src-min-noconflict/ext-language_tools.js"></script>';

    return {
        restrict: 'E',
        scope: true,
        template: function(element, attrs) {
            var position = attrs.position || 'header';

            return position === 'footer' ? footerTemplate : headerTemplate;
        },
        link: function (scope, element, attrs) {
            var settings = appSettings.data;

            // update initial values
            applySettings();

            // listen for updates
            $rootScope.$on('settings.update', function() {
                applySettings();
            });

            function applySettings() {
                scope.editor_ext = settings.editor_ext || { emmet: false, statusbar: false, autocompletion: false };
                scope.theme = settings.theme || 'default';
                scope.animation = settings.anim || 1;
            }



        }
    };
}]);