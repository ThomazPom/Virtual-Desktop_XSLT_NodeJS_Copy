var express = require('express');
var app = express();
app.use(express.static('public'));
var basex = require('basex');
var session = new basex.Session();


var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};


// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


//session.execute('open etablissement_superieur');




app.get('/', function(req, res) {
	res.render("index.ejs");
});


app.get('/xmlData', function(req, res) {
	var qName=req.query.queryName;
	if(qName==undefined)
	{
		console.log("Query name was undefined ! ");
		qName="CP";
	}
	else
	{
		console.log("Query is .. "+qName);
	}

	var query = session.query(xQueries[qName]);
	query.results(function (err, result) {
		if (err) throw err;
		res.setHeader('content-type', 'application/xml');
		res.write('<?xml version="1.0" encoding="UTF-8"?>');
		res.write('<root>');
		var arrayLength = result.result.length;
		for (var i = 0; i < arrayLength; i++) {
		//console.log(result.result[i]);
		res.write(result.result[i]);
	};
	res.write('</root>');
	res.end();
	//res.send('<?xml version="1.0" encoding="UTF-8"?><root>'+result.result.join("")+"</root>");
});
});







var xQueries = {
	"allBase" : "/ONISEP_ETABLISSEMENT/etablissement"
	,"UAI_NOM" : 'let $ms:=db:open("etablissement_superieur","etablissement_superieur.xml" )/ONISEP_ETABLISSEMENT return <etablissements> { for $m in $ms/etablissement return <etablissement> { $m/UAI,$m/nom } </etablissement> } </etablissements>'
	,"CP": "/ONISEP_ETABLISSEMENT/etablissement/cp"
,"NOM_LAT_LON": 'let $ms:=db:open("etablissement_superieur","etablissement_superieur.xml" )/ONISEP_ETABLISSEMENT return <etablissements> { for $m in $ms/etablissement return <etablissement> { $m/nom,$m/latitude_Y,$m/longitude_X } </etablissement> } </etablissements>'
,"STAT_NBET_ACAD":'let $ms:=db:open("etablissement_superieur","etablissement_superieur.xml")/ONISEP_ETABLISSEMENT/etablissement return<stat> <type>camembert</type> <nom>Nombre d&apos;établissement par académie</nom> <total>{count($ms)}</total> <nombres>{ for $etab in $ms let $acad := $etab/academie group by $acad order by $acad return <nombre name="{$acad}">{count($etab)}</nombre>} </nombres> </stat>'
};


console.log("Serveur sur le port 80 / 443");

httpServer.listen(80);
httpsServer.listen(443);