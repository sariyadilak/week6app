function addFeature(){
// add a point
L.marker([51.5, -0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
// add a circle
L.circle([51.508, -0.11], 500, {color: 'red',fillColor: '#f03',fillOpacity: 0.5}).addTo(mymap).bindPopup("I am a circle.");
// add a polygon with 3 end points (i.e. a triangle)
var myPolygon = L.polygon([[51.509, -0.08],[51.503, -0.06],[51.51, -0.047]],{color: 'red',fillColor: '#f03',fillOpacity: 0.5}).addTo(mymap).bindPopup("I am a polygon.");}	
	
	var client;
	// and a variable that will hold the layer itself – we need to do this outside the function so that we use it to remove the layer later on
	var earthquakelayer;
	// create the code to get the Earthquakes data using an XMLHttpRequest
	function getEarthquakes(){
		client = new XMLHttpRequest();
		client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
		client.onreadystatechange = earthquakeResponse;
		client.send();
	}
	// create the code to wait for the response from the data server, and process the response once it is received
	function earthquakeResponse(){
	if(client.readyState == 4){
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
		}
	}


		// load the map
		var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		// load the tiles
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +'Imagery © <a href="http://mapbox.com">Mapbox</a>',id: 'mapbox.streets'}).addTo(mymap);
		var testMarkerRed = L.AwesomeMarkers.icon({
			icon:'play',
			markerColor:'red'
		});
		var testMarkerPink = L.AwesomeMarkers.icon({
			icon:'play',
			markerColor:'pink'
		});
		//customise the loadEarthquakelayer method in the header to use custom icons
	function loadEarthquakelayer(earthquakedata){
			//convert the text received from the server to JSON
			var earthquakejson = JSON.parse(earthquakedata);
			// load the geoJSON layer
			var earthquakelayer = L.geoJson(earthquakejson,
				{
				// use point to layer to create the points
				pointToLayer:function(feature,latlng)
				{
				// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude use a different marker depending on this value
				// also include a pop-up that shows the place value of the earthquakes
				if (feature.properties.mag > 1.75) {
					return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.place+"</b>");
				}
				else {
				// magnitude is 1.75 or less
				return L.marker(latlng, {icon:testMarkerPink}).bindPopup("<b>"+feature.properties.place+"</b>");;
				}
				},
				}).addTo(mymap);
			mymap.fitBounds(earthquakelayer.getBounds());
			}

	var busstoplayer;
	function getBusstops(){
		client = new XMLHttpRequest();
		client.open('GET','./busstops.geojson');
		client.onreadystatechange = busstopResponse;
		client.send();
	}
	// create the code to wait for the response from the data server, and process the response once it is received
	function busstopResponse(){
	if(client.readyState == 4){
		var busstopdata = client.responseText;
		loadBusstoplayer(busstopdata);
		}
	}
	// convert the received data - which is text - to JSON format and add it to the map
	function loadBusstoplayer(busstopdata){
	var busstopjson = JSON.parse(busstopdata);
	busstoplayer=L.geoJson(busstopjson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(busstoplayer.getBounds());
	}

function trackLocation() {
if (navigator.geolocation) {
	navigator.geolocation.watchPosition(showPosition);
} else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}
function showPosition(position) {
	var lat = 51.524616;
	var lng = -0.13818;
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	var LocDist = "<dd>" + position.coords.latitude.toString()+"," +position.coords.longitude.toString() + "</dd>"+ "Distance from Warren Street:  "+distance+"  kms";
	L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup(LocDist).openPopup();
	mymap.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude), 13)
	if (distance < 4) {
	alert('user is within 4 kms from Warren Street');
	}
	else {
	alert ('user is 4 kms away from Warren Street');
	}
}

function removeEarthquakeData(){
	alert("Earthquake data will be removed");
	mymap.removeLayer(earthquakelayer);
}
			

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
var radlat1 = Math.PI * lat1/180;
var radlat2 = Math.PI * lat2/180;
var radlon1 = Math.PI * lon1/180;
var radlon2 = Math.PI * lon2/180;
var theta = lon1-lon2;
var radtheta = Math.PI * theta/180;
var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
subAngle = Math.acos(subAngle);
subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
// where radius of the earth is 3956 miles
if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
return dist;
}

var xhr; // define the global variable to process the AJAX request
function callDivChange() {
xhr = new XMLHttpRequest();
xhr.open("GET", "./test.html", true);
xhr.onreadystatechange = processDivChange;
try {
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
}
catch (e) {
// this only works in internet explorer
}
xhr.send();
}
function processDivChange() {
if (xhr.readyState < 4) // while waiting response from server
document.getElementById('ajaxtest').innerHTML = "Loading...";
else if (xhr.readyState === 4) { // 4 = Response from server has been completely loaded.
if (xhr.status == 200 && xhr.status < 300)
// http status between 200 to 299 are all successful
document.getElementById('ajaxtest').innerHTML = xhr.responseText;
}
}

var poilayer;
	function getPOI(){
		client = new XMLHttpRequest();
		client.open('GET','http://developer.cege.ucl.ac.uk:30281/getGeoJSON/united_kingdom_poi/geom');
		client.onreadystatechange = poiResponse;
		client.send();
	}
	
	function poiResponse(){
	if(client.readyState == 4){
		var poidata = client.responseText;
		loadpoilayer(poidata);
		}
	}

	function loadpoilayer(poidata){
				// convert the text to JSON
				var poijson = JSON.parse(poidata);
				// add the JSON layer onto the map - it will appear using the default icons
				poilayer = L.geoJson(poijson).addTo(mymap);
			// change the map zoom so that all the data is shown
				mymap.fitBounds(poilayer.getBounds());
		}
		
var highwaylayer;
	function getHighway(){
		client = new XMLHttpRequest();
		client.open('GET','http://developer.cege.ucl.ac.uk:30281/getGeoJSON/united_kingdom_highway/geom');
		client.onreadystatechange = highwayResponse;
		client.send();
	}
	
	function highwayResponse(){
	if(client.readyState == 4){
		var highwaydata = client.responseText;
		loadhighwaylayer(highwaydata);
		}
	}

	function loadhighwaylayer(highwaydata){
				// convert the text to JSON
				var highwayjson = JSON.parse(highwaydata);
				// add the JSON layer onto the map - it will appear using the default icons
				highwaylayer = L.geoJson(highwayjson).addTo(mymap);
			// change the map zoom so that all the data is shown
				mymap.fitBounds(highwaylayer.getBounds());
		}


		// load the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +'Imagery © <a href="http://mapbox.com">Mapbox</a>',id: 'mapbox.streets'}).addTo(mymap);
		//add the code that will load the data after the page has loaded


