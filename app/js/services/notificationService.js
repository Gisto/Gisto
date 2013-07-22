'use strict';

angular.module('gisto.service.notificationService', [], function($provide) {
   $provide.factory('notificationService', function(ghAPI, socket) {
       var service = {
           register: function() { // register for notifications on the server.
               console.log('registering user');
               var user = ghAPI.getLoggedInUser().then(function(user) {
                   console.log('register user: ', user);
                   socket.emit('registerClient', { user: user });
               });
           }
       };

       return service;
   });
});