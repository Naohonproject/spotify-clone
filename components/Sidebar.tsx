import IconButton from "./IconButton";
import {
  HomeIcon,
  HeartIcon,
  SearchIcon,
  LibraryIcon,
  RssIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { usePlaylistContext } from "../contexts/PlayListContext";
import useSpotify from "../hooks/useSpotify";

const Divider = () => <hr className="border-t-[0.1px] border-gray-800" />;
const SideBar = () => {
  // when login by spotify , it response a section that we receive as props in _app.tsx and pass it to all pages by SessionProvider
  const { data: session } = useSession();

  // take play list from the PlaylistContextStateData, by call custom hook usePlayListContext
  const {
    playlistContextState: { playlists },
    updatePlaylistContextState,
  } = usePlaylistContext();

  // spotify with access_token
  const spotifyApi = useSpotify();

  const setSelectedPlaylist = async (selectedId: string) => {
    const playlistResponse = await spotifyApi.getPlaylist(selectedId);

    updatePlaylistContextState({
      selectedPlaylistId: selectedId,
      selectedPlaylist: playlistResponse.body,
    });
  };

  return (
    <div className="text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hidden sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block ">
      <div className="space-y-4">
        {session?.user && (
          <button onClick={() => signOut()}>{session.user.name}-Log Out</button>
        )}
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={SearchIcon} label="Search" />
        <IconButton icon={LibraryIcon} label="Your Library" />

        <Divider />

        <IconButton icon={PlusCircleIcon} label="Create Library" />
        <IconButton icon={HeartIcon} label="Like Song" />
        <IconButton icon={RssIcon} label="Your Episode" />
        <Divider />

        {/* playlists */}
        {playlists.map(({ id, name }) => (
          <p
            key={id}
            className="cursor-pointer hover:text-white"
            onClick={() => {
              setSelectedPlaylist(id);
            }}
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
