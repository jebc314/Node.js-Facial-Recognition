var spotifyApi;
window.onload = function() {
    var input = document.getElementById("form").elements[0];
    input.addEventListener("keypress", function(event) {
        var code;
        if (event.key !== undefined) {
            code = event.key;
        } else if (event.keyIdentifier !== undefined) {
            code = event.keyIdentifier;
        } else if (event.keyCode !== undefined) {
            code = event.keyCode;
        }

        // Number 13 is the "Enter" key on the keyboard
        if (code == "Enter" || code === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById("submit_button").click();
        }
      });
      
      spotifyApi = new SpotifyWebApi();

      var callback_url = window.location.href;
      const api_url = "https://accounts.spotify.com/authorize?client_id=603a3368045e46f7ac6e93eae3b95595&response_type=token&redirect_uri="+callback_url;
      var access_token;
      var hash;
      if(!window.location.hash){
          window.location.replace(api_url);
      }else{
          var url = window.location.href;
          hash = url.split('#')[1];
          hash = hash.split('&')[0];
          hash = hash.split('=')[1];
      }
      access_token = hash;
      spotifyApi.setAccessToken(access_token);
}

var track_ids = [];
var track_feel = [];

function open_playlist() {
    var callback_url = window.location.href;
    const api_url = "https://accounts.spotify.com/authorize?client_id=603a3368045e46f7ac6e93eae3b95595&response_type=token&redirect_uri="+callback_url;
    var access_token;
    var hash;
    if(!window.location.hash){
        window.location.replace(api_url);
    }else{
        var url = window.location.href;
        hash = url.split('#')[1];
        hash = hash.split('&')[0];
        hash = hash.split('=')[1];
    }
    access_token = hash;
    spotifyApi.setAccessToken(access_token);

    var form = document.getElementById("form");
    var text = form.elements[0].value;
    console.log(text);
    text = text.split("playlist/")[1];
    text = text.split("?")[0];

    var playlist = document.getElementById("playlist");
    playlist.src = "https://open.spotify.com/embed/playlist/" + text
    spotifyApi.getPlaylist(text).then(
        function (data) {
            console.log(data);
            return data;
        },
        function (err) {
            console.error(err);
        }
    ).then(function (data) {
        var track_items = data.tracks.items;
        var output_string = "";
        var output_paragraph = document.getElementById("playlist_output");
        for (let i = 0; i < track_items.length; i++)
        {
            spotifyApi.getAudioFeaturesForTrack(track_items[i].track.id).then(
                function (d) {
                    output_string += JSON.stringify(d, null, 2) + "<br>";
                    //output_paragraph.innerHTML = output_string;
                    setTimeout(() => {  console.log("World!"); }, 10);
                    var send_text = d.danceability+", " + d.energy + ", " + d.key + ", " + 
                    d.loudness + ", " + d.mode + ", " + d.speechiness +", "+d.acousticness+", " + d.instrumentalness
                    +", " + d.liveness + ", " + d.valence + ", " + d.tempo;
                
                    track_ids.push([track_items[i].track.id, send_text]);
                    return send_text;
                },
                function (err) {
                    console.error(err);
                }
            ).then(
                function(send_text){
                const info_url ='https://python-side.herokuapp.com/' + send_text;

            var queryURL = "https://cors-anywhere.herokuapp.com/" + info_url;

            $.ajax({
                url: queryURL,
                method: "GET",
                dataType: "json",
                // this headers section is necessary for CORS-anywhere
                headers: {
                    "x-requested-with": "xhr" 
                }
            }).done(function(response) {
                console.log('CORS anywhere response', response);
                track_feel.push([track_items[i].track.id, response]);
                output_paragraph.innerHTML += [track_items[i].track.name, track_items[i].track.id, response].toString() + "<br>";
                var feeling = document.getElementById("feeling");
                if (response[0].includes(feeling.innerHTML)) {
                    var frame = document.getElementById("music_player");
                    frame.src = "https://open.spotify.com/embed/track/" + track_items[i].track.id;
                }
                setTimeout(() => {  console.log("World!"); }, 1000);
            }).fail(function(jqXHR, textStatus) { 
                console.error(textStatus)
                output_paragraph.innerHTML += [track_items[i].track.name, track_items[i].track.id, "TOO MANY REQUESTS"].toString() + "<br>";
            })
            });
        }
    });
}