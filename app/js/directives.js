'use strict';

/* Directives */

var app = angular.module('myApp.directives', []);


app.directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]);

app.directive('editor', function($timeout) {
    return function(scope, element, attrs) {
        $timeout(function() {
            var lang = attrs.editor;
            console.log('Lang to highlight: ' + lang);

            var editor = ace.edit(element[0]);
            editor.setTheme("ace/theme/tomorrow");
            editor.getSession().setMode("ace/mode/" + lang);
        }, 0);
    };
});