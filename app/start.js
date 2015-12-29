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
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

session.execute('open etablissement_superieur');

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

	var stringQuery = xQueries[qName];
	console.log("Query is .. ");
	for (var k in req.query){
		console.log("For key " + k + ", value is " + req.query[k]);
		stringQuery = stringQuery.replace(new RegExp("#"+k,'g'),req.query[k]);
	}

	var query = session.query(stringQuery);
	query.results(function (err, result) {
		
		res.setHeader('content-type', 'application/xml');
		res.write('<?xml version="1.0" encoding="UTF-8"?>');
		res.write('<root>');
		if (err) {
			
			res.write('</root>');
			res.end();
			return;
		};
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
	//"allBase" : "/ONISEP_ETABLISSEMENT/etablissement"
	//,"UAI_NOM" : 'let $ms:=/ONISEP_ETABLISSEMENT return <etablissements> { for $m in $ms/etablissement return <etablissement> { $m/UAI,$m/nom } </etablissement> } </etablissements>'
	//,"CP": "/ONISEP_ETABLISSEMENT/etablissement/cp"
	"UN_ETABLISSEMENT": "/ONISEP_ETABLISSEMENT/etablissement[UAI/. = '#UAI']"
	,"NOM_LAT_LON": 'let $ms:=/ONISEP_ETABLISSEMENT return <etablissements> { for $m in $ms/etablissement return <etablissement> { $m/nom,$m/latitude_Y,$m/longitude_X } </etablissement> } </etablissements>'
	,"STATISTIQUE":'let $ms:=/ONISEP_ETABLISSEMENT/etablissement return<stat> <type>#statType</type> <nom>Nombre d&apos;établissement par #groupEtab</nom> <total>{count($ms)}</total> <nombres>{ for $etab in $ms let $groupEtab := $etab/#groupEtab group by $groupEtab order by $groupEtab return <nombre name="{$groupEtab}">{count($etab)}</nombre>} </nombres> </stat>'
	//,"STAT_NBET_ACAD":'let $ms:=/ONISEP_ETABLISSEMENT/etablissement return<stat> <type>#statType</type> <nom>Nombre d&apos;établissement par académie</nom> <total>{count($ms)}</total> <nombres>{ for $etab in $ms let $acad := $etab/academie group by $acad order by $acad return <nombre name="{$acad}">{count($etab)}</nombre>} </nombres> </stat>'
	//,"STAT_NBET_REGI":'let $ms:=/ONISEP_ETABLISSEMENT/etablissement return<stat> <type>#statType</type> <nom>Nombre d&apos;établissement par région</nom> <total>{count($ms)}</total> <nombres>{ for $etab in $ms let $region := $etab/region group by $region order by $region return <nombre name="{$region}">{count($etab)}</nombre>} </nombres> </stat>'
	,"UAI_NOM_GROUP":'let $ms:=/ONISEP_ETABLISSEMENT/etablissement for $etab in $ms let $group := $etab/#groupeEtab group by $group order by $group return <etabGroup name="{$group}">{ for $partEtab in $etab order by $partEtab/#ordreEtab return<etablissement>{$partEtab/UAI,$partEtab/nom}</etablissement> } </etabGroup>'
};


console.log("Serveur sur le port 80 / 443");

httpServer.listen(80);
httpsServer.listen(443);