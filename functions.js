// initialize soundcloud API with key
SC.initialize({
    // This is the sample client_id. you should replace this with your own
    client_id: "02d54efe6695649f5c72cae57841e44a"
});

chrome.tabs.executeScript(null, {code: "var url = document.URL;url;"},
		function(result){
	// Do check for valid URL here
	var attributes=result[0].split('/');
	var track=attributes[attributes.length-1];
	var user=attributes[attributes.length-2];
	var PATH = "/users/"+user+"/tracks/"+track;
	console.log(PATH);
	$(document).ready(
	  function () {
		// Use soundcloud API to get info of the track requested
		SC.get(PATH
		  , function (track, err) {
			// obtain track's id
			var duration = track.duration;
			var TRACK_ID = track.id;
			SC.get("/tracks/"+TRACK_ID+"/comments"
			  , function (comments, err) {
			  // Construct html of output
			  var output = "";
			  comments.sort(compare);
			  for (var i = 0; i < comments.length; i++) {
				  console.log(comments[i]);
				output += "user: " + comments[i].user.username + "<br>";
				output += "comment: " + comments[i].body + "   " +msToTime(comments[i].timestamp)  +" <hr> ";
			  }
			  $("#url").html(output);
			});
		  });
	  });
});
function compare(a,b) {
  if (a.timestamp < b.timestamp)
     return -1;
  if (a.timestamp > b.timestamp)
    return 1;
  return 0;
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
	
	if(hours=="00")
		return minutes + ":" + seconds;
	else{
		return hours + ":" + minutes + ":" + seconds;
	}
    
}

