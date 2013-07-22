var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3000);

var clients = [];

io.sockets.on('connection', function (client) {

    client.on('registerClient', function (data) {
        console.log('REGISTERING CLIENT ' + data.user);
        this.user = data.user;
        clients.push(client);
        console.log(clients);

    });

    client.on('disconnect', function() {
        console.log('client ' + this.user + ' disconnected');
        clients.splice(clients.indexOf(client), 1);
        console.log(clients);
    });
});