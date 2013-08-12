'use strict';

angular.module('gisto.service.notificationService', [], function ($provide) {
    $provide.factory('notificationService', function (ghAPI, socket, $rootScope) {
        var service = {
            notifications: [],
            register: function () {
             // register for notifications on the server.
                var user = ghAPI.getLoggedInUser().then(function (user) {
                    socket.emit('registerClient', { user: user.login });
                });
            },
            logout: function() {
                console.log('log out');
                window.ioSocket.socket.disconnect();
            },
            login: function() {
                if (!window.ioSocket.socket.connected) {
                    window.ioSocket.socket.connect();
                }
            },
            send: function(e, data) {
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
                    console.log('filter', item, id);
                    return item.gistId === id;
                });

                console.log('remove', gist);

                if (gist && gist.length > 0) {
                    for (var i = 0, limit = gist.length; i < limit; i++) {
                        this.notifications.splice(this.notifications.indexOf(gist[i]), 1);
                    }
                }
            }

        };

        return service;
    });
});