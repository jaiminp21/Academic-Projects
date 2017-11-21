//initialize variales
var map;
var markers = [];

function initialize () {
	
	var mapProp = {
		center:new google.maps.LatLng(32.75, -97.13),
		zoom:16,
		panControl:true,
		zoomControl:true,
		mapTypeControl:true,
		scaleControl:true,
		streetViewControl:true,
		overviewMapControl:true,
		rotateControl:true,			
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	map=new google.maps.Map(document.getElementById("map"),mapProp);
}

function sendRequest () {
   clearMarkers();
   markers = [];
   removeRow();
   var southWestlat = "";
   var southWestlag = "";
   var northEastlat = "";
   var northEastlag = "";
   southWestlat = map.getBounds().getSouthWest().lat();
   southWestlag = map.getBounds().getSouthWest().lng();
   northEastlat = map.getBounds().getNorthEast().lat();
   northEastlag = map.getBounds().getNorthEast().lng();
   
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("search").value);
   var replaced = query.replace(' ', '+');
   xhr.open("GET", "proxy.php?term="+replaced+"&bounds="+southWestlat+","+southWestlag+"|"+northEastlat+","+northEastlag+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		  
		  var id = "";
		  var image_url = "";
		  var name = "";
		  var url = "";
		  var rating_img_url = "";
		  var snippet_text = "";
		  var latitude = "";
		  var longitude = "";
		  var marker;
		  var i = 0;
		  var rank = 1;
		  
		  var output = document.getElementById("output");
		  var inner1 = document.createElement("div");
		  inner1.className = "inner1";
			
		  for (i = 0 ; i< json.businesses.length ; i++){
			id = json.businesses[i].id;
			image_url = json.businesses[i].image_url; 
			name = json.businesses[i].name; 
			url = json.businesses[i].url; 
			rating_img_url = json.businesses[i].rating_img_url;
			snippet_text = json.businesses[i].snippet_text;
			latitude = json.businesses[i].location.coordinate.latitude;
			longitude = json.businesses[i].location.coordinate.longitude;
			marker = new google.maps.Marker({position: new google.maps.LatLng(latitude, longitude),label: rank+"",map: map});
			markers.push(marker);
			rank++;
			
			var hotelImage = document.createElement("img");
			hotelImage.src = image_url;
			hotelImage.alt = "image not available";
			inner1.appendChild(hotelImage);
			inner1.appendChild(document.createElement("br"));
			var hotelLink = document.createElement("a");
			hotelLink.text = name;
			hotelLink.href = url;
			inner1.appendChild(hotelLink);
			inner1.appendChild(document.createElement("br"));
			var hotelratingImage = document.createElement("img");
			hotelratingImage.src = rating_img_url;
			inner1.appendChild(hotelratingImage);
			inner1.appendChild(document.createElement("br"));
			var snipetText = document.createElement("p");
			snipetText.innerHTML = "<pre>"+snippet_text+"</pre>";
			inner1.appendChild(snipetText);
			inner1.appendChild(document.createElement("br"));
			output.appendChild(inner1);
			
		}
			function showMarkers() {
				setMapOnAll(map);
			}
		};
	}
	xhr.send(null);
}

function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }
function clearMarkers() {
        setMapOnAll(null);
      }
	  
function removeRow() {
	var elem = document.getElementById("output");
	if(elem.hasChildNodes())
	{ 
		var i = 0;
		for (i = 0 ; i<elem.childNodes.length ; i++){
				elem.removeChild(elem.childNodes[i]);
		}
	}	    
}