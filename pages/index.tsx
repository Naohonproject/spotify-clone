import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Center from "../components/Center";
import PlayListContextProvider from "../contexts/PlayListContext";
import Player from "../components/Player";
import SongContextProvider from "../contexts/SongContext";

const Home: NextPage = () => {
  return (
    <PlayListContextProvider>
      <SongContextProvider>
        <div className="bg-black h-screen overflow-hidden">
          <Head>
            <title>Spotify Clone</title>
            <meta name="description" content="Cloned Spotify by Le Tuan Bao" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex">
            <Sidebar />
            <Center />
          </main>
          <div className="sticky bottom-0 text-white">
            <Player />
          </div>
        </div>
      </SongContextProvider>
    </PlayListContextProvider>
  );
};

export default Home;
