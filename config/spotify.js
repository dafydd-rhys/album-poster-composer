const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

let tokenExpirationEpoch;

const initializeSpotify = () => {
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      tokenExpirationEpoch =
        new Date().getTime() / 1000 + data.body["expires_in"];
      console.log("Got an access token: " + spotifyApi.getAccessToken());
      console.log("Got a refresh token: " + spotifyApi.getRefreshToken());
    },
    function (err) {
      console.log(
        "Something went wrong when retrieving an access token!",
        err.message
      );
    }
  );
};

const refreshToken = () => {
  if (tokenExpirationEpoch < new Date().getTime() / 1000) {
    spotifyApi.refreshAccessToken().then(
      function (data) {
        tokenExpirationEpoch =
          new Date().getTime() / 1000 + data.body["expires_in"];
        spotifyApi.setAccessToken(data.body["access_token"]);
        console.log("Refreshed token");
      },
      function (err) {
        console.log("Could not refresh the token.", err.message);
      }
    );
  }
};

module.exports = { spotifyApi, initializeSpotify, refreshToken };
