import { usePlaylistContext } from "../contexts/PlayListContext";
import Song from "./Song";
import { v4 as uuidv4 } from "uuid";

const Songs = () => {
  const {
    playlistContextState: { selectedPlaylist },
  } = usePlaylistContext();

  if (!selectedPlaylist) {
    return null;
  }
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28">
      {selectedPlaylist.tracks.items.map((item, index) => {
        return <Song key={uuidv4()} item={item} itemIndex={index} />;
      })}
    </div>
  );
};

export default Songs;
