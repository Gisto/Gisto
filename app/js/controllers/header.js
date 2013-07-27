'use strict';

function headerController($scope, $rootScope, notificationService) {

    $scope.avatar = 'https://secure.gravatar.com/avatar/' + JSON.parse(localStorage.settings).avatar;

    if (!$rootScope.hasOwnProperty('userRegistered') || !$rootScope.userRegistered)  {
        notificationService.register();
    }


}