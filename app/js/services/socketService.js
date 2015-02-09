'use strict';

angular.module('gisto.service.socket', [], function ($provide) {
    $provide.factory('socket', function (socketFactory, appSettings) {

        console.log( 'Socket connection string', appSettings.get('share_server').connection_string );
        var socket = io.connect( appSettings.get('share_server').connection_string );

        // save the socket as a reference for use later
        window.socketIO = socket;

        return socketFactory({
            //prefix: '',
            ioSocket: socket
        });
    });
});