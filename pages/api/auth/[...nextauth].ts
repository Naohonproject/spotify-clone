import NextAuth, { CallbacksOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "../../../config/spotify";
import { ExtendedToken, TokenError } from "../../../types";

const refreshAccessToken = async (
  token: ExtendedToken
): Promise<ExtendedToken> => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    // spotify, let's reset token
    const { body: refreshedAccessToken } =
      await spotifyApi.refreshAccessToken();

    // after let spotifyApi refresh the token success fully, we receive the received refreshedAccessToken
    // return the updated access token from spotify
    return {
      ...token,
      accessToken: refreshedAccessToken.access_token,
      refreshToken: refreshedAccessToken.refresh_token || token.refreshToken,
      accessTokenExpireAt: Date.now() + refreshedAccessToken.expires_in * 1000,
    };
  } catch (error) {
    console.error(error);
    // if there is error from try block , error from spotifyApi.refreshAccessToken();
    // return token with error
    return {
      ...token,
      error: TokenError.RefreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  //  user login for the first time, account user exist
  // after that, this props will not exist
  // we need to store it to reuse
  let extendedToken: ExtendedToken;
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpireAt: (account.expires_at as number) * 1000,
    };

    return extendedToken;
  }
  // subsequent requests to check auth session, when ever we call useSession
  // if access token still valid, just return token
  if (Date.now() + 500 < (token as ExtendedToken).accessTokenExpireAt) {
    // access token still valid
    return token;
  }

  // not go into the if block above , means not first time sign-in , and
  // access token expired, return the access refreshed access token
  return await refreshAccessToken(token as ExtendedToken);
  // access token has expired,refresh it
};

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
}) => {
  session.accessToken = (token as ExtendedToken).accessToken;
  session.error = (token as ExtendedToken).error;
  return session;
};

// Export function to authorization
export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      // right of our app, ask spotify through next-auth by provide the credential
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: { scope: scopes },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // use to define what we will do after login successfully
  callbacks: {
    // use this callback to extend the token that server will use to authenticate
    // jwt go first then session
    jwt: jwtCallback,
    // use this callback to change the data that pass to client in session
    session: sessionCallback,
  },
});
