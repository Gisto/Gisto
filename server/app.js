var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3000);

var clients = [];

io.sockets.on('connection', function (client) {

    client.on('registerClient', function (data) {
        console.log('registering client: ' + data.user);
        this.user = data.user;
        clients.push(client);

    });

    client.on('disconnect', function() {
        console.log('client ' + this.user + ' disconnected');
        clients.splice(clients.indexOf(client), 1);
    });

    client.on('sendNotification', function(data) {

        var recipient = clients.filter(function(item) {
            return item.user === data.recipient;
        });

        if (recipient) {
            console.log(recipient);
            if (recipient.length > 0) {
                io.sockets.socket(recipient[0].id).emit('receiveNotification', { sender: client.user, gistId: data.gistId, name: data.name});
            }
        } else {
            console.log('recipient 404 queue notification');
        }

    });
});