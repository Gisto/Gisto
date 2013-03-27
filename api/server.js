var express = require('express'),
    gists = require('./routes/gists');
 
var app = express();
 
 // allow post data
 app.use(express.bodyParser());

 // gist control

app.get('/gists', gists.listGists);
app.get('/gists/starred', gists.getStarredGists);
app.get('/gists/:id', gists.getGistById);
app.get('/gists/star/:id', gists.starGistById);
app.get('/gists/unstar/:id', gists.unStarGistById);
app.get('/gists/comments/:id', gists.getGistCommentsByGistId);
app.post('/gists/create', gists.createGist);
app.post('/gists/edit', gists.editGist);



// authentication
app.get('/auth/:user/:pass', gists.auth);
 
app.listen(3000);
console.log('Listening on port 3000...');