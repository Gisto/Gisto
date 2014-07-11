
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    clientToken = require('./config.js').clientToken,
    analytics = require('nodealytics');

var databaseUrl = "gisto",
    collections = ["notifications"],
    db = require('mongojs').connect(databaseUrl, collections);

analytics.initialize('UA-40972813-1', 'gistoapp.com', function() {
    //MORE GOOGLE ANALYTICS CODE HERE
});

server.listen(3001);

var clients = [];

io.sockets.on('connection', function(client) {

    console.log('client connected');
    io.sockets.to(client.id).emit('identify');

    client.on('registerClient', function(data) {
        console.log(data);
        if (!data.hasOwnProperty('token') || data.token !== clientToken) {
            console.log('failed authentication');
            client.disconnect();
            return;
        }

        console.log('registering client: ' + data.user);
        this.user = data.user;
        clients.push(client);

        // check for existing notifications
        db.notifications.find({
            recipient: data.user
        }, function(err, notifications) {
            if (err || !notifications) {
                console.log('no pending notifications');
            } else {

                notifications.forEach(function(notification) {
                    io.sockets.to(client.id).emit('receiveNotification', notification);
                });
            }
        });

        var userAgent = data['useragent'] || 'application';

        if (userAgent !== 'plugin') {
            analytics.trackEvent('clientLogin', data.user, function(err, resp) {
                if (!err && resp.statusCode === 200) {
                    console.log('Event has been tracked');
                }
            });
            console.log('track login');
        }


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
            gistId: item.gistId
        }, false);

        // send all clients that the notification has been read.
        var recipient = getAllClientSockets(clients, client.user);

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

        var recipient = getAllClientSockets(clients, data.recipient);
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

function getAllClientSockets(clients, username) {
    return clients.filter(function(item) {
        return item.user === username;
    });
} 