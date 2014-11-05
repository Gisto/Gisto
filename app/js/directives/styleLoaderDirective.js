'use strict';

angular.module('gisto.directive.styleLoader', []).directive('styleLoader', ['appSettings', '$rootScope', function (appSettings, $rootScope) {
    return {
        restrict: 'E',
        template: '<link rel="stylesheet" href="themes/{{theme}}/theme.css" /><link rel="stylesheet" href="css/animation.css" ng-if="animation"/>',
        scope: true,
        link: function (scope, element, attrs) {
            console.log('header settings', appSettings);

            var settings = appSettings.data;

            // update initial values
            updateFields();

            // listen for updates
            $rootScope.$on('settings.update', function() {
                updateFields();
            });

            function updateFields() {
                scope.theme = settings.theme || 'default';
                scope.animation = settings.anim || 1;
            }



        }
    };
}]);