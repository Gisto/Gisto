'use strict';

angular.module('gisto.service.notificationService', [], function ($provide) {
    $provide.factory('notificationService', function (ghAPI, socket, $rootScope) {
        var service = {
            notifications: [],
            register: function () { // register for notifications on the server.
                var user = ghAPI.getLoggedInUser().then(function (user) {
                    socket.emit('registerClient', { user: user.login });
                });
            },
            send: function(e, data) {
                console.log();
                console.log(service.connected);
                if (!window.ioSocket.socket.connected) {
                    // notify
                    $rootScope.$broadcast('serverFailure');
                    return;
                }

                socket.emit(e,data);
            },
            forward: socket.forward,
            add: function (notification) {
                console.log(notification);
                this.notifications.push(notification);
            },
            remove: function (id) {

                if (!window.ioSocket.socket.connected) {
                    // notify
                    $rootScope.$broadcast('serverFailure');
                    return;
                }

                var gist = this.notifications.filter(function (item) {
                    return item.id === id;
                });

                if (gist) {
                    this.notifications.splice(this.notifications.indexOf(gist), 1);
                    this.send('notificationRead', {gistId: id});
                }
            }

        };

        return service;
    });
});