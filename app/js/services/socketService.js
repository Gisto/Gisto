'use strict';

angular.module('gisto.service.socket', [], function ($provide) {
    $provide.factory('socket', function (socketFactory, appSettings) {

        console.log( ' ------- Socket connection string', appSettings.get('endpoints').enterprise.share_server_on );

        var conn_string = (appSettings.get('active_endpoint') === 'enterprise'
        && appSettings.get('endpoints').enterprise.share_server_on === true
        && appSettings.get('endpoints').enterprise.share_server_conn_string !== '')
            ? appSettings.get('endpoints').enterprise.share_server_conn_string
            : 'http://server.gistoapp.com:3001';

        var socket = io.connect( conn_string );

        console.log( '------- Connection string', conn_string);

        // save the socket as a reference for use later
        window.socketIO = socket;

        return socketFactory({
            //prefix: '',
            ioSocket: socket
        });
    });
});