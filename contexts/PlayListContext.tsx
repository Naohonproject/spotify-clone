import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import useSpotify from "../hooks/useSpotify";

import { IPlayListContext, PlaylistContextState } from "../types";

const defaultPlayListContextState: PlaylistContextState = {
  playlists: [],
  selectedPlaylistId: null,
  selectedPlaylist: null,
};

export const PlaylistContext = createContext<IPlayListContext>({
  playlistContextState: defaultPlayListContextState,
  updatePlaylistContextState: () => {},
});

// this is custom hook that return the data of context returned by useContext(PlaylistContext)
export const usePlaylistContext = () => useContext(PlaylistContext);

// this we just take the children from prom props , so we explicitly
// declare that object {children} must have type {children : ReactNode }
// means { children} implements an type alias look like:
// type childrenProp = {children : ReactNode}
// then we can write it in another way like :
// {children} : childrenProp
const PlayListContextProvider = ({ children }: { children: ReactNode }) => {
  const [playlistContextState, setPlaylistContextState] = useState(
    defaultPlayListContextState
  );

  const updatePlaylistContextState = (
    updatedObj: Partial<PlaylistContextState>
  ) => {
    setPlaylistContextState((previousPlaylistContextState) => ({
      ...previousPlaylistContextState,
      ...updatedObj,
    }));
  };

  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  useEffect(() => {
    // when session change, call getUserPlaylist is called again
    // set playListContextState again
    const getUserPlaylist = async () => {
      const userPlayListResponse = await spotifyApi.getUserPlaylists();
      updatePlaylistContextState({
        playlists: userPlayListResponse.body.items,
      });
    };

    if (spotifyApi.getAccessToken()) {
      getUserPlaylist();
    }
  }, [session]);

  const playListContextProviderData = {
    playlistContextState,
    updatePlaylistContextState,
  };
  return (
    <PlaylistContext.Provider value={playListContextProviderData}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlayListContextProvider;
