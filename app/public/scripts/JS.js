
console.log("document.URL : "+document.URL);
console.log("document.location.href : "+document.location.href);
console.log("document.location.origin : "+document.location.origin);
console.log("document.location.hostname : "+document.location.hostname);
console.log("document.location.host : "+document.location.host);
console.log("document.location.pathname : "+document.location.pathname);

var idDivContent = 0;
$(".divFrame").mousedown(function()
{
	$( ".divContent" ).css("z-index",500);
	$(this).parent().css("z-index",600);

});
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
	
	
	divFrame.append("<div class='map'></div>");

	map = divFrame.children(".map")[0];
	map = new google.maps.Map(map, {
		center: {lat: 48.8534100, lng: 2.3488000},
		zoom: 4
	});
}
function initDataExplorer(divFrame)
{
	divFrame.append("<div class='form-group'><label>Afficher les établissement par..</label>"+
		"<select class='selectDataClassement form-control'></select></div>");

}
function initStatistic(divFrame)
{
	divFrame.append("<h1>Statistiques de la base de données</h1>");
}
function getXSLTemplate(templateName)
{

}
function getXMLData(xPath)
{

}
function writeXML(dataDiv, templateName, xPath)
{

}
