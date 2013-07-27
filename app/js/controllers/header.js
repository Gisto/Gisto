'use strict';

function headerController($scope, $rootScope, notificationService) {

    notificationService.forward('receiveNotification', $scope);

    $scope.avatar = 'https://secure.gravatar.com/avatar/' + JSON.parse(localStorage.settings).avatar;
    $scope.notifications = [];

    if (!$rootScope.hasOwnProperty('userRegistered') || !$rootScope.userRegistered)  {
        notificationService.register();
    }

    $scope.$on('socket:receiveNotification', function(e, data) {
        $scope.notifications.push({
            sentBy: data.sender,
            gistId: data.gistId
        });

        console.log($scope.notifications);
    });


}