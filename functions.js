// Initialize SoundCloud API with key
SC.initialize({
    client_id: "02d54efe6695649f5c72cae57841e44a"
});
// Get the URL when on SoundCloud
chrome.tabs.executeScript(null, {code: "var url = document.URL;url;"},
		function(result){
	// Check that SoundCloud is being used
	var soundcloudCheck=result[0].indexOf('soundcloud.com/');
	if(soundcloudCheck<0){
		// TODO Update some error text that URL is incorrect
		console.log('Not SoundCloud URL');
		return;
	}
	result[0].substring(soundcloudCheck+"soundcloud.com/".length,result[0].length)
	var attributes=result[0].split('/');
	var track=attributes[attributes.length-1];
	var user=attributes[attributes.length-2];
	// Create a PATH to be used to gather information about the track
	var PATH = "/users/"+user+"/tracks/"+track;
	$(document).ready(
	  function () {
		// Use SoundCloud API to get info of the track requested
		SC.get(PATH
		  , function (track, err) {
			// obtain track's id
			var duration = track.duration;
			var track_id = track.id;
			SC.get("/tracks/"+track_id+"/comments"
			  , function (comments, err) {
			  var output = "";
			  // Sort the array by time occuring on track
			  comments.sort(compare);
			  for (var i = 0; i < comments.length; i++) {
					output += "user: " + comments[i].user.username + "<br>";
				output += "comment: " + comments[i].body + "   " +msToTime(comments[i].timestamp)  +" <hr> ";
			  }
			  $("#url").html(output);
			});
		  });
	  });
});

// Compare function used to sort comments array by timestamp
function compare(a,b) {
  if (a.timestamp < b.timestamp)
     return -1;
  if (a.timestamp > b.timestamp)
    return 1;
  return 0;
}

// Function to convert milliseconds into seconds minutes and hours.
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

