'use strict';

angular.module('gisto.service.notificationService', [], function ($provide) {
    $provide.factory('notificationService', function (ghAPI, socket, $rootScope, $http, $q, appSettings) {

        var hashString = function(text) {
            var hash = 0, i, chr, len;
            if (text.length == 0) return text;
            for (i = 0, len = text.length; i < len; i++) {
                chr   = text.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        var service = {
            notifications: [],
            isOnline: false,
            token: '',
            endpoint: '',

            register: function () {
             // register for notifications on the server.
                $q.all([
                    $http.get('./config.json'),
                    ghAPI.getLoggedInUser(),
                    appSettings.loadSettings()
                ]).then(function(data) {
                        service.token = data[0].data.server_token;
                        var settings = data[2];
                        service.endpoint = settings.active_endpoint === 'enterprise' ? settings.endpoints['enterprise'].api_url : 'https://api.github.com';
                        socket.emit('registerClient', { user: data[1].login, token: service.token, endpoint: hashString(service.endpoint) });
                        $rootScope.$broadcast('ApplicationState', { online: true });
                });
            },
            logout: function() {
                console.log('log out');
                socketIO.io.disconnect();
            },
            login: function() {
                // reset the reconnecting flag as it gets stuck on true when disconnected.
                socketIO.io.reconnecting = false;
                socketIO.io.reconnect();
            },
            send: function(e, data) {
                // add endpoint hash to the data object
                data.endpoint = hashString(service.endpoint);
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

//                if (!window.ioSocket.socket.connected) {
//                    // notify
//                    $rootScope.$broadcast('serverFailure');
//                    return;
//                }

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