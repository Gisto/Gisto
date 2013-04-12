var github = require('octonode'),
        settings = require('../modules/settings'),
        ghgist = null;

exports.auth = function(req, res) {

    res.contentType('application/json');

    // authenticate
    github.auth.config({
        username: req.params.user,
        password: req.params.pass
    }).login(['user', 'repo', 'gist'], function(err, id, token) {
        settings.token = token; // save the client token
        settings.client = github.client(settings.token); // create a client object
        settings.client.get('/user', function(err, status, body) { // get user details
            settings.info = body;
        });

        ghgist = settings.client.gist(); // create a reference to gist api
        res.send({
            id: id,
            token: token,
            err: err
        });
    });


}

exports.listGists = function(req, res) {
    res.contentType('application/json');
    ghgist.list(function(err, data) {
        res.send(data);
    })

};


exports.getStarredGists = function(req, res) {
    res.contentType('application/json');
    ghgist.starred(function(err, data) {
        res.send(data);
    })
};

exports.getGistById = function(req, res) {
    res.contentType('application/json');
    ghgist.get(req.params.id, function(err, data) {
        res.send(data);
    })
};

exports.createGist = function(req, res) {
    res.contentType('application/json');

    ghgist.create({
        description: req.body.description,
        "public": req.body.public,
        files: req.body.files
    }, function(err, data) {
        if (err) {
            res.send({status: 'error', error: err});
        }

        res.send({status: 'ok', data: data});
    });

};

exports.editGist = function(req, res) {

    ghgist.edit(req.body.id, {
        description: req.body.description,
        files: req.body.files
    }, function(err, data) {
        if (err) {
            res.send({status: 'error', error: err});
        }

        res.send({'status': "ok", data: data});
    });

};


exports.deleteGist = function(req, res) {
    console.log(req.params.id);
    console.log(req.body.id);
    ghgist.delete(req.params.id);
    res.send({'status': "ok"});

};


exports.starGistById = function(req, res) {
    res.contentType('application/json');
    ghgist.star(req.params.id);
    res.send({
        complete: 'complete'
    });
};

exports.unStarGistById = function(req, res) {
    res.contentType('application/json');
    ghgist.unstar(req.params.id);
    res.send({
        complete: 'complete'
    });
};

exports.getGistCommentsByGistId = function(req, res) {
    res.contentType('application/json');
    ghgist.comments(req.params.id, function(err, data) {
        res.send(data);
    });
};

exports.deleteGistCommentById = function(req, res) {

};

exports.editGistCommentById = function(req, res) {

};