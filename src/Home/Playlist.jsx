import React, { useContext, useEffect, useState } from "react";
import Song from "../components/Song";
import back from "../assets/icons8-left-100.png"
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../App";

export default function Playlist() {
  let playlistData;
  const playContext = useContext(AppContext)
  let [playlist, setPlaylist] = useState({
    image: [{
      link: "",
    },{},{}] || "",
    name: "",
    songCount: "",
    songs: [],
    username: ""
  })
  let [isPlaying, setIsPlaying] = useState(false); //complete list plays
  let [psSong, setPsPlay] = useState(false) //individual song plays
  const { playlistid } = useParams();

  function playPlaylist() {
    setIsPlaying(!isPlaying);
    playContext.setPlayQue(playlist.songs)
  }

  async function getPlaylist() {
    const music = await fetch(`https://saavn.me/playlists?id=${playlistid}`);
    playlistData = await music.json();
    setPlaylist(playlistData.data);
  }
  // console.log(playlist);

  useEffect(()=>{ 
    getPlaylist()
  },[])

  return (
    <>
      <div className="w-full xl:w-[calc(100%+44%)] mx-auto h-full top-0 left-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-neutral-800 to-black">
        <div className="w-full h-auto relative border-b-2 border-gray-700 flex justify-between items-end py-8 px-4 pr-6 bg-gradient-to-t from-black to-green-500">
        <Link to="/home" className="w-auto h-auto right-5 top-3 absolute">
            <button className="bg-transparent border-none mr-1"><img src={back} alt="back" className="w-10 h-10"/></button>
        </Link>
          <span className="w-auto h-auto -mt-3 lg:w-96 flex flex-col items-start lg:flex-row lg:items-center">
            <img src={playlist.image ? playlist.image[2].link : ""} alt="playlist-image" className="w-[110px] h-[110px] lg:w-32 lg:h-32 ml-2 mr-5"/>
            <h2 className="w-52 h-auto text-white text-xl lg:text-3xl my-2 pl-2 lg:pl-0 font-bold text-left whitespace-pre-line lg:whitespace-nowrap">{playlist.name}</h2>
          </span>
          <button
              onClick={playPlaylist}
              className="w-32 md:w-auto h-12 bg-green-400 px-4 rounded-md transition-all ease delay-25 hover:mb-2 flex items-center justify-evenly border-none outline-none"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="w-4 h-4 mr-3"
                >
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
              <p className="text-[14px] md:text-md text-black font-bold whitespace-nowrap">Add to que</p>
            </button>
        </div>
        <ul className="w-full h-[calc(100%-23%)] py-2 md:p-4 overflow-y-scroll scroll-smooth">
          {playlist.songs.map((playsong)=><Song playsong={playsong} setPsPlay={setPsPlay} key={playsong.id} playlistSong={playlist}/>)}
        </ul>
      </div>
    </>
  );
}
