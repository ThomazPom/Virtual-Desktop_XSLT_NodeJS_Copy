
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
		divContent.css("width","60vw").css("height","50vh");
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
		zoom: 5
	});
	getXMLData("NOM_LAT_LON",placeAllPointsOn,map);
}
function initDataExplorer(divFrame)
{
	divFrame.append("<div class='form-group'><label>Afficher les établissement par..</label>"+
		"<select class='selectDataClassement form-control'></select></div><div class='xsltReceiver' id='xsltReceiver"+idDivContent+"'></div>");
	writeXML(  divFrame.children(".xsltReceiver")[0],"UAI_NOM", "UAI_NOM");

}
function initStatistic(divFrame)
{
	divFrame.append("<h1>Statistiques de la base de données</h1>");
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
function getXMLData(qName,callback,arg)
{
	console.log("getXMLData(qName,callback,arg)");
	var data = $.get( "/xmlData",{ queryName: qName}).done(function( data ) {
	}, 0);
	var interval = setInterval(function(){ 
		
		if(data.statusText=='OK')
		{
			clearInterval(interval);
			console.log("getXMLData(qName,callback,arg)--->interval--->callback");
			callback(data,arg);
		}
		else{
			console.log("getXMLData(qName,callback,arg)--->interval--->else " + data.statusText );
			
		}
	},0);

}

function writeXML(dataDiv, qName,templateName)
{
	console.log("writeXML(dataDiv, qName,templateName)");
	new Transformation().setXml("/xmlData?queryName="+qName)
	.setXslt("/xslt/"+templateName+".xsl").transform(dataDiv.id);
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
		title: 'name'
	});
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});


}



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