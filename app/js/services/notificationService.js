'use strict';

angular.module('gisto.service.notificationService', [], function ($provide) {
    $provide.factory('notificationService', function (ghAPI, socket, $rootScope) {
        var service = {
            notifications: [],
            userGravatarId: '',
            register: function () { // register for notifications on the server.
                console.log('registering user');
                $rootScope.userRegistered = true;
                var user = ghAPI.getLoggedInUser().then(function (user) {
                    console.log('register user: ', user);
                    socket.emit('registerClient', { user: user.login });
                    service.userGravatarId = user.gravatar_id;
                    console.log('garvaar id', user.gravatar_id);
                    console.log(user);
                });
            },
            send: function (gistId, gistName, user, gravatar_id) {
                socket.emit('sendNotification', { recipient: user, gistId: gistId, name: gistName, gravatar_id: service.userGravatarId });
            },
            forward: socket.forward,
            add: function (notification) {
                this.notifications.push(notification);
            },
            remove: function (id) {
                var gist = this.notifications.filter(function (item) {
                    return item.id === id;
                });

                if (gist) {
                    this.notifications.splice(this.notifications.indexOf(gist), 1);
                }
            }

        };

        return service;
    });
});