import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { spotifyApi } from "../config/spotify";
import { ExtendedSession, TokenError } from "../types";

// this hooks will be use to check and assign access token to spotifyApi instance
//  when ever this hook would be call in any component
// will return a new spotifyApi ,that have access token or an error
// if have error , means token is invalid , so redirect to login page
const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      return;
    }
    // if refresh token fail => login again
    if (
      (session as unknown as ExtendedSession).error ===
      TokenError.RefreshAccessTokenError
    ) {
      signIn();
    }

    //   let client use spotify api by set access token to it ,
    //   before this states, client just have the token, it can use this to talk to our app
    //   but we use spotifyWebApi to talk to spotify api , so that we need to set-up that token to spotifyApi instance
    //  anytime spotify api call to spotify, it will request with this access token
    spotifyApi.setAccessToken(
      (session as unknown as ExtendedSession).accessToken
    );
  }, [session]);
  return spotifyApi;
};

export default useSpotify;
