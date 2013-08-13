var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , clientToken = require('./config.js').clientToken;

var databaseUrl = "gisto",
    collections = ["notifications"],
    db = require('mongojs').connect(databaseUrl, collections);


server.listen(3000);

var clients = [];

io.sockets.on('connection', function (client) {

   console.log('client connected');
    io.sockets.socket(client.id).emit('identify');

    client.on('registerClient', function (data) {
        console.log(data);
        if ( !data.hasOwnProperty('token') || data.token !== clientToken) {
            console.log('failed authentication');
            client.disconnect();
            return;
        }


        console.log('registering client: ' + data.user);
        this.user = data.user;
        clients.push(client);

        // check for existing notifications
        db.notifications.find({recipient: data.user}, function(err, notifications) {
           if (err || !notifications) {
               console.log('no pending notifications');
           }  else {

               notifications.forEach( function(notification) {
                   io.sockets.socket(client.id).emit('receiveNotification', notification);
               } );
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
        db.notifications.remove({recipient: client.user, gistId: item.gistId}, false);

        // send all clients that the notification has been read.
        var recipient = getAllClientSockets(clients,client.user);

        if (recipient && recipient.length > 0) {

            for (var i = 0, limit = recipient.length; i < limit; i++) {
                console.log('sending notification: ' + i);
                io.sockets.socket(recipient[i].id).emit('notificationRead',  {gistId: item.gistId});
            }
        }

    });

    client.on('sendNotification', function(data) {

        var recipient = getAllClientSockets(clients,data.recipient);
        console.log('clients', recipient);
        if (recipient && recipient.length > 0) {

            for (var i = 0, limit = recipient.length; i < limit; i++) {
                io.sockets.socket(recipient[i].id).emit('receiveNotification', { sender: client.user, gistId: data.gistId, name: data.name, gravatar_id: data.gravatar_id});
            }
        }

        // save the notification
        db.notifications.save({
            sender: client.user,
            recipient: data.recipient,
            gistId: data.gistId,
            name: data.name,
            gravatar_id: data.gravatar_id
        }, function(err, saved) {
           if (err || !saved) {
               console.log('notification failed to save');
           }  else {
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