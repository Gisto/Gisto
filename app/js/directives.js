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
 			var extension = attrs.editor.split('.').pop();
 			console.log(getLanguage(extension));


 			var editor = ace.edit(element[0]);
			editor.setTheme("ace/theme/textmate");
			editor.getSession().setMode("ace/mode/" + getLanguage(extension));
		},0);
 		
 	};
});

 var getLanguage = function(ext) {
 	console.log('getLanguage');

 	if (ext === 'cs') {
 		return 'csharp';
 	} else if (ext === 'js') {
 		return 'javascript';
 	} else {
 		return ext;
 	}
 }