window.onload = function() {
    var signin_button = document.getElementById("sign-in");

    signin_button.onclick = function() {
        var callback_url = "https://webcam-to-music.herokuapp.com/spotifeeling.html";
        const api_url = "https://accounts.spotify.com/authorize?client_id=603a3368045e46f7ac6e93eae3b95595&response_type=token&redirect_uri="+callback_url;

        window.location.replace(api_url);
    }
}