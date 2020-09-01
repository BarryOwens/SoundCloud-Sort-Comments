// Get the URL when on SoundCloud
chrome.tabs.executeScript(null, {code: "var url = document.URL;url;"},
function(result){
	const currentURL = result[0];
	// Check that SoundCloud is being used
	var soundcloudCheck=result[0].indexOf('soundcloud.com/');
	if(soundcloudCheck<0){
		console.log('Not soundcloud url')
		printErrorMessage();
		return;
	}
	const baseURL = "https://api.soundcloud.com";
	const clientId = "02d54efe6695649f5c72cae57841e44a";
	// Get details about the track on the page
	const trackDetailsURI = `${baseURL}/resolve?url=${currentURL}&client_id=${clientId}`
	$.get(trackDetailsURI)
	.then(trackData => {
		const trackCommentsURI = `${baseURL}/tracks/${trackData.id}/comments?client_id=${clientId}` 
		return $.get(trackCommentsURI)
	})
	.then(comments => {
		var output = "";
		// Sort the array by time occurring on track
		comments.sort(compare);
		for (var i = 0; i < comments.length; i++) {
			output +="<b> " +msToTime(comments[i].timestamp)  + "</b><br>";
			output +="<b>" +comments[i].user.username +"</b>: " + comments[i].body    +" <br>  _____________________________________<br> "; // Use underscore instead of <hr> to allow css ::Selection to work
		}
		$("#comments").html(output);
	}).catch(err => {
		console.error('err:', err);
		alert("There was an error getting comments")
	})
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

