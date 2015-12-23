
// console.log("document.URL : "+document.URL);
// console.log("document.location.href : "+document.location.href);
// console.log("document.location.origin : "+document.location.origin);
// console.log("document.location.hostname : "+document.location.hostname);
// console.log("document.location.host : "+document.location.host);
// console.log("document.location.pathname : "+document.location.pathname);

var idDivContent = 0;

function divContentTopIndex(sender)
{
	$( ".divContent" ).css("z-index",500);
	console.log(sender);
	sender.parent().css("z-index",600);	
}

$(".divFrame").mousedown(divContentTopIndex);
$(".appicon").click(function()
{
	var divContent = $( "#divContent" ).clone().appendTo( "#content" ).attr("id","divContent" +idDivContent).css("display","block").css("position","absolute")
	.css("top",100+(idDivContent*10)%100+"px").css("left",100+(idDivContent*10)%100+"px").draggable({
		handle:".divFrame>nav"
	}).resizable().click(function()
	{
		$( ".divContent" ).css("z-index",500);
		$(this).css("z-index",600);
	});



	divContentTopIndex(divContent);
	if ($(this).attr("id")=="linkMap") 
	{

		divContent.css("width","90vw").css("height","80vh");
		initMap(divContent.find(".divFrame"));
	}
	if ($(this).attr("id")=="linkExplorer") 
	{
		divContent.css("width","60vw").css("height","50vh");
		initDataExplorer(divContent.find(".divFrame"));
	}
	if ($(this).attr("id")=="linkStatistic") 
	{
		divContent.css("width","60vw").css("height","70vh");
		initStatistic(divContent.find(".divFrame"));
	}
	idDivContent++;
});
function initMap(divFrame) {
	if(divFrame==undefined)divFrame=$('#content');
	var map = document.createElement('div');
	map.className = 'map';
	divFrame[0].appendChild(map);
	map = new google.maps.Map(map, {
		center: {lat: 48.8534100, lng: 2.3488000},
		zoom: 6
	});
	getData("/xmlData","NOM_LAT_LON",map,placeAllPointsOn);
}
var xsltreceiver ;
function initDataExplorer(divFrame)
{
	divFrame.append("<div class='form-group'><label>Afficher les établissement par..</label>"+
		"<select class='selectDataClassement form-control'></select></div>");
	xsltreceiver= document.createElement("div");
	xsltreceiver.className ="xsltReceiver";
	xsltreceiver.id="xsltReceiver"+idDivContent
	divFrame.append(xsltreceiver);
	getData("/xmlData","UAI_NOM",xsltreceiver,function(xmlResponse,xsltreceiver)
	{
		getData("/xslt/UAI_NOM.xsl","",xsltreceiver,function(xslResponse,xsltreceiver){
			writeXML(xsltreceiver,xslResponse.responseXML,xmlResponse.responseXML)
		});
	});

	

}
function initStatistic(divFrame)
{
	divFrame.append("<h1>Statistiques de la base de données</h1>");
	var xsltreceiver = document.createElement("div");
	xsltreceiver.className ="xsltReceiver";
	xsltreceiver.id="xsltReceiver"+idDivContent
	divFrame.append(xsltreceiver);

	getData("/xmlData","STAT_NBET_ACAD",xsltreceiver,function(xmlData,xsltreceiver)
	{
		getData("/xslt/statTemplate2.xsl","",xsltreceiver,function(xslData,xsltreceiver){
			writeXML(xsltreceiver,xslData.responseXML,xmlData.responseXML)
			drawCamembertsXsL(xsltreceiver);
		});
	});


}
function drawCamembertsXsL(xsltreceiver)
{
	$(xsltreceiver).find("camembert").each(function(){
		$(this).children("svg").children("circle").each(function(){
			$(this).css("stroke",'#'+Math.random().toString(16).substr(2,6))
		});
	});
}


var lololol = null;

function formatDataIE(data){
	if(data.responseXML.firstElmentChild==undefined);
	{
		console.log("Données converties pour ie");
		return {'responseXML':$.parseXML(xhttp.responseText)};
	}
	return data;
}

////////////////////////FONCTION DE PLACEMENTS DES POINTS DANS {DATA} SUR {MAP}
function placeAllPointsOn(data,map)
{
	// console.log(data.responseXML.documentElement.firstElementChild);
	// console.log(map);
	data=formatDataIE(data);
	console.log(" placeAllPointsOn(data,map)");
	var etablissements= data.responseXML.firstChild.firstElementChild;
	var etablissementlenght = etablissements.childElementCount*2;
	for (var i = 1; i < etablissementlenght; i+=2) {
		var etablissement = etablissements.childNodes[i];
		var nom = etablissement.childNodes[1].firstChild.nodeValue;
		var latitude = etablissement.childNodes[3].firstChild.nodeValue;
		var longitude = etablissement.childNodes[5].firstChild.nodeValue;
		createPointOnMap(map,latitude,longitude,nom)
	}


}
function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
  	var ua = navigator.userAgent;
  	var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
  	if (re.exec(ua) != null)
  		rv = parseFloat( RegExp.$1 );
  }
  return rv;
}
///////////////////////Get data utilisant JAVASCRIPT

function getData(URL,qName,arg,callback)
{
	console.log("getData(qName,callback,arg)");
	var ver = getInternetExplorerVersion();

	if (ver > -1)
	{

		console.log("IE");
		xhttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	else 
	{

		console.log("OZER");
		xhttp = new XMLHttpRequest();
	}
	xhttp.open("GET", URL+"?"+"queryName="+qName, true);
try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
xhttp.send("");

var interval = setInterval(function(){ 

	if(xhttp.responseXML!=null)
	{
		clearInterval(interval);
		console.log("getData(URL,qName,callback,arg)--->interval--->callback");
		callback(xhttp,arg);
	}
	else{
		console.log("getData(URL,qName,callback,arg)--->interval--->else " + xhttp.statusText );
	}
},0);

}


//////////////FONCTION ECRITEURE DE {XML DOC} parsé avec {XSLDOC} dans {DATA DIV}
function writeXML(dataDiv,xslDoc,xmlDoc)
{

	if (window.ActiveXObject || xhttp.responseType == "msxml-document")
	{
		ex = xmlDoc.transformNode(xslDoc);
		dataDiv.innerHTML = ex;
	}
// code for Chrome, Firefox, Opera, etc.
else if (document.implementation && document.implementation.createDocument)
{
	xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet(xslDoc);
	resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
	dataDiv.appendChild(resultDocument);
}

}



function createPointOnMap(map,latitude,longitude,name)
{
	console.log(" createPointOnMap(map,latitude,longitude,name)");
	
	var contentString = '<h2>'+name+'</h2>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	var marker = new google.maps.Marker({
		position: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
		map: map,
		title: name
	});
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});


}

/*
///////////////////FONCTION CONVERSION D'ANGLES[ABANDONNE CAUSE FONCTIONS UTILISANT ABBANDONNEES]
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

///////////////////FONCTION DESCRIPTION DE QUART DE CERCLE [ABANDONNE CAUSE FONCTIONS UTILISANT ABBANDONNEES]
function describeArc(x, y, radius, startAngle, endAngle){

	var start = polarToCartesian(x, y, radius, endAngle);
	var end = polarToCartesian(x, y, radius, startAngle);

	var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	var d = [
	"M", start.x, start.y, 
	"A", radius, radius, 0, arcSweep, 0, end.x, end.y,
	"L", x,y,
	"L", start.x, start.y
	].join(" ");

	return d;       
}*/
/*
document.getElementById("arc1").setAttribute("d", describeArc(200, 400, 100, 0, 220));*/


// function writeXML2(dataDiv, qName,templateName)
// {
// 	$.get( "/xmlData",{ queryName: qName}).done(function(xmlFile)
// 	{
// 		$.get( "/xslt/"+templateName+".xsl").done(function(xmlTemplate){
// 			new Transformation().setXml(xmlFile.responseText)
// 			.setXslt(xmlTemplate.responseText).transform(dataDiv.id);
// 		});
// 	}
// 	);
// }

///////////////////FONCTION DESSIN ARC DE CERCLE DE TEMPLATE#1 [ABANDONNE CAUSE INCOMPATIBILITES NAVIGATEURS]
/*function drawCamemberts(xsltreceiver)
{
	var statistiques=xsltreceiver.getElementsByTagName("camembert");
	var stats = $(xsltreceiver).children("camembert");

	stats.each(function(){
		var svg = $(this).children("svg");
		var cercle = svg.children("circle");
		var total=parseFloat(cercle.html());
		var decalage=0;
		svg.children("path").each(function()
		{
		var portion = parseFloat($(this).html());
		var pourcentage = portion/total *360;
		$(this).attr("fill",'#'+Math.random().toString(16).substr(2,6));
		$(this).attr("d", describeArc(parseFloat(cercle.attr("cx")), parseFloat(cercle.attr("cy")), parseFloat(cercle.attr("r")), decalage, decalage+pourcentage));
		decalage=decalage+pourcentage;
		$(this).mouseenter(function(){
			oldcolor=$(this).attr("fill");
			$(this).attr("fill","darkgray")
			$(this).attr("stroke-width","5px")

		}).mouseleave(function(){
			$(this).attr("fill",oldcolor)
			$(this).attr("stroke-width","0px")
		});
	});

	//	$(this).children("")
});
}
*/
///////////////////////Get data utilisant JQUERY [ABANDONNE CAUSE : INCOMPATIBLE INTERNET EXPLORER] 
/*function getData(URL,qName,arg,callback)
{
	console.log("getData(qName,callback,arg)");
	var data = $.get( URL,{ queryName: qName}).done(function( data ) {
	}, 0);
	var interval = setInterval(function(){ 
		
		if(data.statusText=='OK')
		{
			clearInterval(interval);
			console.log("getData(URL,qName,callback,arg)--->interval--->callback");
			callback(data,arg);
		}
		else{
			console.log("getData(URL,qName,callback,arg)--->interval--->else " + data.statusText );
			
		}
	},0);

}
*/