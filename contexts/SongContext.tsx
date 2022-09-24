import { createContext, ReactNode, useContext } from "react";
import { ISongContext, SongContextState } from "../types";

const defaultSongContextState: SongContextState = {
  selectedPlaylistId: undefined,
  selectedSong: null,
  isPlaying: false,
  volume: 50,
  deviceId: null,
};

export const SongContext = createContext<ISongContext>({
  songContextState: defaultSongContextState,
});

export const useSongContext = () => useContext(SongContext);

const SongContextProvider = ({ children }: { children: ReactNode }) => {
  const songContextProviderData: ISongContext = {
    songContextState: defaultSongContextState,
  };
  return (
    <SongContext.Provider value={songContextProviderData}>
      {children}
    </SongContext.Provider>
  );
};

export default SongContextProvider;
