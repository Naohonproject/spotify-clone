import {
  SwitchHorizontalIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  FastForwardIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { useSongContext } from "../contexts/SongContext";
import useSpotify from "../hooks/useSpotify";
import { SongReducerActionType } from "../types";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { ChangeEventHandler } from "react";

let selectedSongCast: SpotifyApi.TrackObjectFull;
const Player = () => {
  const {
    dispatchSongAction,
    songContextState: { isPlaying, selectedSong, deviceId, volume },
  } = useSongContext();

  selectedSongCast = selectedSong as SpotifyApi.TrackObjectFull;

  const spotifyApi = useSpotify();
  const handlePlayPause = async () => {
    const response = await spotifyApi.getMyCurrentPlaybackState();
    if (!response.body) {
      return;
    }
    if (response.body.is_playing) {
      await spotifyApi.pause();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: false,
      });
    } else {
      await spotifyApi.play();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: true,
      });
    }
  };

  const handleNextOrBackSong = async (action: "next" | "back") => {
    // if there is no device that is the real player are active, do nothing
    if (!deviceId) {
      return;
    }
    // check to do the remote work base on the choose of next mode of back mode
    if (action === "back") {
      await spotifyApi.skipToPrevious();
    } else {
      await spotifyApi.skipToNext();
    }
    const songInfo = await spotifyApi.getMyCurrentPlayingTrack();

    if (!songInfo.body) return;

    dispatchSongAction({
      type: SongReducerActionType.SetCurrentPlayingSong,
      payload: {
        selectedSongId: songInfo.body.item?.id as string,
        selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
        isPlaying: songInfo.body.is_playing,
      },
    });
  };

  const debounceAdustVolume = useDebouncedCallback((volume: number) => {
    spotifyApi.setVolume(volume);
  }, 500);

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const volume = Number(event.target.value);
    if (!deviceId) {
      return;
    }

    debounceAdustVolume(volume);

    dispatchSongAction({
      type: SongReducerActionType.SetVolume,
      payload: volume,
    });
  };
  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center space-x-4">
        {selectedSong && (
          <>
            <div className="hidden md:block">
              <Image
                src={selectedSongCast?.album.images[0].url}
                alt="song cover"
                height="40px"
                width="40px"
              />
            </div>
            <div>
              <h3>{selectedSongCast.name} </h3>
              <p>{selectedSongCast.artists[0].name}</p>
            </div>
          </>
        )}
      </div>
      {/* center */}
      <div className="flex justify-evenly items-center">
        <SwitchHorizontalIcon className="icon-playback" />
        <RewindIcon
          onClick={() => handleNextOrBackSong("back")}
          className="icon-playback"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="icon-playback" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="icon-playback" />
        )}
        <FastForwardIcon
          onClick={() => handleNextOrBackSong("next")}
          className="icon-playback"
        />
        <ReplyIcon className="icon-playback" />
      </div>
      {/* right */}
      <div className="flex justify-end items-center pr-5 space-x-3 md:space-x-4">
        <VolumeUpIcon className="icon-playback" />
        <input
          type="range"
          min={0}
          max={100}
          className="w-20 md:w-auto"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default Player;
