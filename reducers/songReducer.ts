import {
  SongContextState,
  SongReducerAction,
  SongReducerActionType,
} from "../types";

export const songReducer = (
  state: SongContextState,
  { type, payload }: SongReducerAction
): SongContextState => {
  switch (type) {
    case SongReducerActionType.SetDevice:
      return {
        ...state,
        deviceId: payload.deviceId,
        volume: payload.volume,
      };
    case SongReducerActionType.ToggleIsPlaying:
      return {
        ...state,
        isPlaying: payload,
      };
    case SongReducerActionType.SetCurrentPlayingSong:
      const { isPlaying, selectedSong, selectedSongId } = payload;
      return {
        ...state,
        selectedSongId,
        selectedSong,
        isPlaying,
      };

    default:
      return state;
  }
};
