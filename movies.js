function initialize () {
}

function sendRequest () {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		  
		  for (var i = 1; i < json.results.length; i++){
					var movieTitle = "";
					var movieId = ""; 
					movieTitle = json.results[i].original_title+"   	"+json.results[i].release_date.substring(0,4)+"\n";
					movieId = json.results[i].id;
					
					var iDiv = document.createElement('li');
					iDiv.id = movieId;
					iDiv.className = movieId;
					iDiv.textContent = movieTitle;
					document.getElementsByTagName('ul')[0].appendChild(iDiv);					
				}
					document.querySelector('ul').addEventListener('click', function(event) {
					if (event.target.tagName.toLowerCase() == 'li') {
						GetMovieDetails(event.target.id);
						}
					});
       }
   };
   xhr.send(null);
}


function GetMovieDetails(number) {
   var num = number;
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?method=/3/movie/" + num);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
        var json = JSON.parse(this.responseText);
        var str = JSON.stringify(json,undefined,2);
		var genres = "";
		for(var i=0 ; i<json.genres.length ; i++){
			 if(genres == "")
					genres = json.genres[i].name;				
				genres = genres +" , "+ json.genres[i].name;
		} 
		var base_url = "http://image.tmdb.org/t/p/w154";
		document.getElementById("outputPoster").src = base_url+json.poster_path;
		document.getElementById("outputPoster").alt="Image not available";
		document.getElementById("outputTitle").innerHTML = "<pre>" +"Title:\n".bold().fontsize(4)+ json.original_title+ "</pre>";
		document.getElementById("outputGener").innerHTML = "<pre>" +"Genres:\n ".bold().fontsize(4)+ genres + "</pre>";
		document.getElementById("outputOverview").innerHTML = "<pre>" +"Overview:\n ".bold().fontsize(4)+json.overview+ "</pre>";
		GetCast(num);
       }
   };
   xhr.send(null);	
}


function GetCast(number) {
   var num = number;
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?method=/3/movie/" + num +"/credits");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
        var json = JSON.parse(this.responseText);
        var str = JSON.stringify(json,undefined,2);
		var cast = "";
		var i = 0;
		for(i=0 ; i<json.cast.length ; i++){
			 if(cast == ""){
				 cast = json.cast[i].name;
			 }
			 else{
				cast = cast +" , "+ json.cast[i].name; 
			 }
				if(i == 4)
				{break;}
		} 
		
		document.getElementById("outputCast").innerHTML = "<pre>" +"Lead Cast:\n ".bold().fontsize(4)+ cast + "</pre>";
       }
   };
   xhr.send(null);	
}





