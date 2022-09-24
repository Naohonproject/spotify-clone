import { Session } from "inspector";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export enum TokenError {
  RefreshAccessTokenError = "RefreshAccessTokenError",
}

export interface ExtendedToken extends JWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireAt: number;
  user: User;
  error?: TokenError;
}

export interface ExtendedSession extends Session {
  accessToken: ExtendedToken["accessToken"];
  error: ExtendedToken["error"];
}

export interface PlaylistContextState {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  selectedPlaylistId: string | null;
  selectedPlaylist: SpotifyApi.SinglePlaylistResponse | null;
}

export interface IPlayListContext {
  playlistContextState: PlaylistContextState;
  updatePlaylistContextState: (
    updatedObj: Partial<PlaylistContextState>
  ) => void;
}
