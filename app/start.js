var express = require('express');

var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
	res.render("index.ejs");
});
app.get('/xmlDebug', function(req, res) {

});


console.log("Serveur sur le port 80 ");
app.listen(80);