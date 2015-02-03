
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    config = require('./config.js');

var collections = ["notifications"],
    db = require('mongojs').connect(config.connectionString, collections);

server.listen(3001);
console.log('server started');

var clients = [];

io.sockets.on('connection', function(client) {

    console.log('client connected');
    io.sockets.to(client.id).emit('identify');

    client.on('registerClient', function(data) {
        console.log(data);
        if (!data.hasOwnProperty('token') || data.token !== config.clientToken) {
            console.log('failed authentication');
            client.disconnect();
            return;
        }

        console.log('registering client: ' + data.user);
        this.user = data.user;
        // assign the endpoint or the default endpoint (hash of api.github.com)
        this.endpoint = data.endpoint || config.clientId;
        clients.push(client);

        console.log({recipient: data.user, endpoint: data.endpoint});

        // check for existing notifications
        db.notifications.find({
            recipient: data.user,
            endpoint: data.endpoint
        }, function(err, notifications) {
            if (err || !notifications) {
                console.log('no pending notifications');
            } else {

                notifications.forEach(function(notification) {
                    io.sockets.to(client.id).emit('receiveNotification', notification);
                });
            }
        });
    });

    client.on('disconnect', function() {
        console.log('client ' + this.user + ' disconnected');
        clients.splice(clients.indexOf(client), 1);
    });

    client.on('notificationRead', function(item) {

        console.log('recieved notification');

        // remove notification from database
        db.notifications.remove({
            recipient: client.user,
            endpoint: client.endpoint,
            gistId: item.gistId
        }, false);

        // send all clients that the notification has been read.
        var recipient = getAllClientSockets(clients, client.user, client.endpoint);

        if (recipient && recipient.length > 0) {

            for (var i = 0, limit = recipient.length; i < limit; i++) {
                console.log('sending notification: ' + i);
                io.sockets.to(recipient[i].id).emit('notificationRead', {
                    gistId: item.gistId
                });
            }
        }

    });

    client.on('sendNotification', function(data) {

        var recipient = getAllClientSockets(clients, data.recipient, data.endpoint);
        console.log('clients', recipient);

        // add the sender
        data.type = data.type || 'share';
        if (data.type === 'share') {
            data.sender = client.user;
        }

        if (recipient && recipient.length > 0) {

            for (var i = 0, limit = recipient.length; i < limit; i++) {
                io.sockets.to(recipient[i].id).emit('receiveNotification', data);
            }
        }

        // save the notification
        db.notifications.save(data, function(err, saved) {
            if (err || !saved) {
                console.log('notification failed to save');
            } else {
                console.log('notification saved');
            }
        });


    });
});

function getAllClientSockets(clients, username, endpoint) {
    return clients.filter(function(item) {
        return item.user === username && item.endpoint === endpoint;
    });
} 