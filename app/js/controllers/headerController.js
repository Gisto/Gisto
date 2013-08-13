'use strict';

function headerController($scope, notificationService, $location, appSettings, gistData, onlineStatus) {

    notificationService.login();

    notificationService.forward('receiveNotification', $scope);
    notificationService.forward('notificationRead', $scope);
    notificationService.forward('identify', $scope);
    notificationService.forward('disconnect', $scope);

    $scope.avatar = 'https://secure.gravatar.com/avatar/' + JSON.parse(localStorage.settings).avatar;
    $scope.notifications = notificationService.notifications;

    $scope.logOut = function () {

        console.log('logging out');
        notificationService.logout();

        gistData.list = [];
        appSettings.logOut();
    };

    $scope.onlineStatus = onlineStatus;

    $scope.$watch('onlineStatus.isOnline()', function(online) {
       if (online && (!window.ioSocket.socket.connected || !window.ioSocket.socket.reconnecting) ) {
           notificationService.login();
       } else if (!online) {
           notificationService.disconnected();
       }
    });

    $scope.$on('socket:disconnect', function(e) {
       console.log('disconnected');
        notificationService.disconnected();
    });

    $scope.$on('socket:identify', function(e, data) {
        // identify to the server
        console.log('recieved identify request');
        notificationService.register();

    });

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

    $scope.$on('socket:notificationRead', function(e, data) {
        // remove read notification
        console.log('recieved read notification deleting notification');
        (data && data.gistId) && notificationService.remove(data.gistId);
    });

    $scope.loadExternalGist = function(id, user) {
        $location.url('/shared/' + user + '/' + id);
    };

    $scope.reject = function(id) {
        console.log('remove id: ' + id);
        notificationService.remove(id);
        notificationService.send('notificationRead', {gistId: id});
    };

}