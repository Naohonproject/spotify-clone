import { signOut, useSession } from "next-auth/react";
import { usePlaylistContext } from "../contexts/PlayListContext";
import Image from "next/image";
import UserIcon from "../assets/avatar.jpg";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { pickRandom } from "../utils/pickRandom";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Center = () => {
  const {
    playlistContextState: { selectedPlaylist, selectedPlaylistId },
  } = usePlaylistContext();

  const [fromColors, setFromColors] = useState<string | null>(null);

  useEffect(() => {
    setFromColors(pickRandom(colors));
  }, [selectedPlaylistId]);

  const { data: session } = useSession();
  return (
    <div className="text-white flex-grow relative h-screen overflow-y-scroll scrollbar-hidden">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => {
            signOut();
          }}
          className={`flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2`}
        >
          <Image
            src={session?.user?.image || UserIcon}
            alt="Avatar"
            height="40px"
            width="40px"
            className="rounded-full object-cover"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="icon" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${fromColors} to-black h-80 p-8`}
      >
        {selectedPlaylist && (
          <>
            <Image
              className="shadow-2xl"
              src={selectedPlaylist.images[0].url}
              alt="play list image"
              height="176px"
              width="176px"
            />
            <div>
              <p className="uppercase">Play List</p>
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">
                {selectedPlaylist.name}
              </h1>
            </div>
          </>
        )}
      </section>
      <Songs />
    </div>
  );
};

export default Center;
