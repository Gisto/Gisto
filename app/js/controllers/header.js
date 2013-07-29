'use strict';

function headerController($scope, $rootScope, notificationService, $location) {

    notificationService.forward('receiveNotification', $scope);

    $scope.avatar = 'https://secure.gravatar.com/avatar/' + JSON.parse(localStorage.settings).avatar;
    $scope.notifications = notificationService.notifications;

    if (!$rootScope.hasOwnProperty('userRegistered') || !$rootScope.userRegistered)  {
        notificationService.register();
    }

    $scope.$on('socket:receiveNotification', function(e, data) {
        console.log(data);
        notificationService.add({
            sender: data.sender,
            name: data.name,
            gistId: data.gistId,
            gravatar_id: data.gravatar_id
        });
        console.log({sender: data.sender,
            name: data.name,
            gistId: data.gistId,
            gravatar_id: data.gravatar_id});
    });

    $scope.loadExternalGist = function(id, user) {
        $location.url('/shared/' + user + '/' + id);
    };


}