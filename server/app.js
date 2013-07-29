var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

var databaseUrl = "gisto",
    collections = ["notifications"],
    db = require('mongojs').connect(databaseUrl, collections);


server.listen(3000);

var clients = [];

io.sockets.on('connection', function (client) {

    client.on('registerClient', function (data) {
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

        // remove notification from database
        db.notifications.remove({recipient: client.user, gistId: item.gistId}, false);

    });

    client.on('sendNotification', function(data) {

        var recipient = clients.filter(function(item) {
            return item.user === data.recipient;
        });

        if (recipient && recipient.length > 0) {
            io.sockets.socket(recipient[0].id).emit('receiveNotification', { sender: client.user, gistId: data.gistId, name: data.name, gravatar_id: data.gravatar_id});
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