'use strict';
angular.module('gisto.service.mobileNavigation', [])
    .run(['$rootScope', '$spMenu', function ($rootScope, $spMenu) {
        $rootScope.$spMenu = $spMenu;
    }])
    .provider("$spMenu", function () {
        this.$get = [function () {
            var menu = {};

            menu.show = function show() {
                var menu = angular.element(document.querySelector('#sp-nav'));
                console.log(menu);
                menu.addClass('show');
            };

            menu.hide = function hide() {
                var menu = angular.element(document.querySelector('#sp-nav'));
                menu.removeClass('show');
            };

            menu.toggle = function toggle() {
                var menu = angular.element(document.querySelector('#sp-nav'));
                menu.toggleClass('show');
            };

            return menu;
        }];
    });
