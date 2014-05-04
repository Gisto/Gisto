'use strict';

angular.module('gisto.service.notificationService', [], function ($provide) {
    $provide.factory('notificationService', function (ghAPI, socket, $rootScope, $http, $q) {
        var service = {
            notifications: [],
            isOnline: false,
            token: '',

            register: function () {
             // register for notifications on the server.
                $q.all([
                    $http.get('./config.json'),
                    ghAPI.getLoggedInUser()
                ]).then(function(data) {
                        service.token = data[0].data.server_token;
                        socket.emit('registerClient', { user: data[1].login, token: service.token });
                        $rootScope.$broadcast('ApplicationState', { online: true });
                });
            },
            logout: function() {
                console.log('log out');
                window.ioSocket.socket.disconnect();
            },
            login: function() {
                window.ioSocket.socket.connect();
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

                console.log('notification', notification);

                notification.type = notification.type || 'share';

                // check for notification type
                if (notification.type === 'share') { // share notification

                    // check for duplicate notifications
                    var filter = this.notifications.filter(function(item) {
                        return  item.gistId === notification.gistId;
                    });
                    console.log(filter);
                    if (filter.length > 0) {
                        return; // duplicate notification found do not add to list
                    };
                }

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
            },
            disconnected: function() {
                $rootScope.$broadcast('ApplicationState', { online: false });
            }

        };

        return service;
    });
});