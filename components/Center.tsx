import { signOut, useSession } from "next-auth/react";
import { usePlaylistContext } from "../contexts/PlayListContext";
import Image from "next/image";
import UserIcon from "../assets/avatar.jpg";
import { ChevronDownIcon } from "@heroicons/react/outline";

const Center = () => {
  const { playlistContextState } = usePlaylistContext();

  const { data: session } = useSession();
  return (
    <div className="text-white flex-grow relative h-screen overflow-y-scroll scrollbar-hidden">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => {
            signOut();
          }}
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2"
        >
          <Image
            src={session?.user?.image || UserIcon}
            alt="User Avatar"
            height="40px"
            width="40px"
            className="rounded-full object-cover"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="icon" />
        </div>
      </header>
    </div>
  );
};

export default Center;
