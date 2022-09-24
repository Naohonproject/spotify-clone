import SpotifyWebApi from "spotify-web-api-node";

// define the right to ask spotify to you on the account
const scopes = [
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
].join(",");

// declare the id and client secret for using the spotify service on the user we have clientId and clientSecret
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export { scopes, spotifyApi };
