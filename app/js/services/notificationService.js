'use strict';

angular.module('gisto.service.notificationService', [], function($provide) {
   $provide.factory('notificationService', function(ghAPI, socket, $rootScope) {
       var service = {
           register: function() { // register for notifications on the server.
               console.log('registering user');
               $rootScope.userRegistered = true;
               var user = ghAPI.getLoggedInUser().then(function(user) {
                   console.log('register user: ', user);
                   socket.emit('registerClient', { user: user });
               });
           },
           send: function(gistId, user) {
               socket.emit('sendNotification', { recipient: user, gistId: gistId });
           }
       };

       return service;
   });
});