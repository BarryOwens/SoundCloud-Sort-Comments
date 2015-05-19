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
		printErrorMessage();
		return;
	}
	var userNameTrackName=result[0]=result[0].substring(soundcloudCheck+"soundcloud.com/".length,result[0].length)
	var attributes=userNameTrackName.split('/');
	// Ensure a correct URL to a SoundCloud Track is used
	if(attributes.length!=2){
		printErrorMessage();
		return;
	}
	// Extract the found Track and User
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
			// If a bad URL was used, the Track ID will be null so show an error
			if(track_id==undefined){
				printErrorMessage();
				return;
			}
			SC.get("/tracks/"+track_id+"/comments"
			  , function (comments, err) {
			  var output = "";
			  // Sort the array by time occurring on track
			  comments.sort(compare);
			  for (var i = 0; i < comments.length; i++) {
					output +="<b> " +msToTime(comments[i].timestamp)  + "</b><br>";
					output +="<b>" +comments[i].user.username +"</b>: " + comments[i].body    +" <br>  _____________________________________<br> "; // Use underscore instead of <hr> to allow css ::Selection to work
			  }
			  $("#comments").html(output);
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
	else
		return hours + ":" + minutes + ":" + seconds;
}
// Error message to display for bad URL used
function printErrorMessage()
{
	$("#comments").html("<br><br><b> Not a valid SoundCloud track URL </b><br><br>Make sure URL is similar to soundcloud.com/user/trackname");
}

