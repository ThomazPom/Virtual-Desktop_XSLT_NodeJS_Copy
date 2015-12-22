
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

	getData("/xmlData","STAT_NBET_ACAD",xsltreceiver,function(xmlResponse,xsltreceiver)
	{
		getData("/xslt/statTemplate.xsl","",xsltreceiver,function(xslResponse,xsltreceiver){
			writeXML(xsltreceiver,xslResponse.responseXML,xmlResponse.responseXML)
			drawCamemberts(xsltreceiver);
		});
	});


}
function drawCamemberts(xsltreceiver)
{
	var statistiques=xsltreceiver.getElementsByTagName("camembert");
	for (var j = statistiques.length - 1; j >= 0; j--) {
		
		var cercle = statistiques[j].getElementsByTagName("circle")[0];
		var total = parseFloat(cercle.firstChild.nodeValue);
		var paths = statistiques[j].getElementsByTagName("path");
		var decalage=0;
		for (var i = paths.length - 1; i >= 0; i--) {
			var path = paths[i];
			portion = parseFloat(path.firstChild.nodeValue);
			pourcentage = portion/total *360;
			path.setAttribute("fill",'#'+Math.random().toString(16).substr(2,6));
			console.log(decalage + " " +pourcentage) ;
			path.setAttribute("d", describeArc(parseFloat(cercle.getAttribute("cx")), parseFloat(cercle.getAttribute("cy")), parseFloat(cercle.getAttribute("r")), decalage, decalage+pourcentage));
			decalage=decalage+pourcentage;
			$(path).mouseenter(function(){
				oldcolor=$(this).attr("fill");
				$(this).attr("fill","darkgray")
				$(this).attr("stroke-width","5px")

			}).mouseleave(function(){
				$(this).attr("fill",oldcolor)
								$(this).attr("stroke-width","0px")
			});
		};
	};



	
}
function placeAllPointsOn(data,map)
{
	// console.log(data.responseXML.documentElement.firstElementChild);
	// console.log(map);

	console.log(" placeAllPointsOn(data,map)");
	var etablissements=data.responseXML.documentElement.firstElementChild;
	var etablissementlenght = etablissements.childElementCount;
	for (var i = 0; i < etablissementlenght; i++) {
		var etablissement = etablissements.children[i];
		var nom = etablissement.children[0].firstChild.nodeValue;
		var latitude = etablissement.children[1].firstChild.nodeValue;
		var longitude = etablissement.children[2].firstChild.nodeValue;
		createPointOnMap(map,latitude,longitude,nom)
	}


}
function getData(URL,qName,arg,callback)
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

function writeXML(dataDiv,xslDoc,xmlDoc)
{

	xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet(xslDoc);
	resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
	dataDiv.appendChild(resultDocument);

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



function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

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
}
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