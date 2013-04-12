var express = require('express'),
        gists = require('./routes/gists');

var app = express();

// allow post data
app.use(express.bodyParser());

// Allow X-origin access to API
app.all('*', function(req, res, next) {
    //if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method)
        return res.send(200);
    next();
});

// gist control
app.get('/gists', gists.listGists);
app.get('/gists/starred', gists.getStarredGists);
app.get('/gists/:id', gists.getGistById);
app.get('/gists/star/:id', gists.starGistById);
app.get('/gists/unstar/:id', gists.unStarGistById);
app.get('/gists/comments/:id', gists.getGistCommentsByGistId);
app.post('/gists/create', gists.createGist);
app.post('/gists/edit', gists.editGist);
app.get('/gists/delete/:id', gists.deleteGist);




// authentication
app.get('/auth/:user/:pass', gists.auth);

app.listen(3000);
console.log('Listening on port 3000...');