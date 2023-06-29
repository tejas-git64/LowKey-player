import React, {useState, useEffect, useContext} from "react";
import shiny from "../assets/icons8-sparkling-96.png";
import back from "../assets/icons8-left-100.png"
import expanded from "../assets/icons8-down-96.png";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../App";

export default function Library() {
  const playlist = document.getElementById('name')
  let [showPlay, setShowPlay] = useState(true);
  let [showFol, setShowFol] = useState(true);
  let [status, setStatus] = useState(false);
  let [isCreate,setIsCreate] = useState(false);
  let libContext = useContext(AppContext)
  let { artistId } = useParams()

  function removePlaylist(index) {
    const newArray = [...libContext.yourPlaylists[0]]
    newArray.splice(index,1)
    libContext.yourPlaylists[1](newArray)
  }

  //toggling creation
  function toggleCreate() {
    setIsCreate(prev => !prev)
  }

  //Playlist Creation
    function createPlaylist() {
        libContext.yourPlaylists[1]((prev)=>[
            ...prev,
            {
                playlistName: playlist.value,
                songs: [{
                name: "Unknown song",
                primaryArtists: "Unknown",
                downloadUrl: [{},{},{},{},{
                  link: ""
                }],
                duration: "",
                id: "",
                index: 0,
                isPlaying: false,
                      image: [{
                  link: ""
                },{},{}]
                }]
            }
        ])
        toggleCreate()
    }

  useEffect(() => {
    window.addEventListener("online", () => {
      setStatus(window.navigator.onLine);
    });
  }, []);

  function showPlaylist(e) {
    e.preventDefault()
    setShowPlay(!showPlay);
  }

  function showFollowings() {
    setShowFol(!showFol);
  }

  return (
    <>
      <div
        className="w-full h-full lg:w-[calc(100%-50%)] xl:w-[calc(100%-70%)] z-10 relative overflow-y-scroll">
        <img
          src="/sound-waves.png"
          alt="music-logo"
          className="w-16 h-16 m-4 ml-6"
        />
        <Link to="/home" className="w-auto h-auto absolute right-5 top-7">
            <button className="bg-transparent border-none"><img src={back} alt="back" className="w-10 h-10"/></button>
        </Link>
        <ul className="w-full h-[calc(100vh-15vh)] overflow-y-scroll lg:flex flex-col justify-start items-center border-zinc-300">
          <div className="w-full h-auto mt-2">
            <li className={`w-full h-auto ${isCreate ? "hidden" : "block"}`}>
              <button 
              onClick={toggleCreate}
              className="w-full h-16 flex items-center justify-evenly bg-purple-800 hover:bg-purple-700">
                <p className="font-bold text-white text-lg ml-7 whitespace-nowrap">
                  Create new playlist
                </p>
                <img src={shiny} alt="new" className="w-6 h-6 mx-6 ml-16" />
              </button>
            </li>
            <li className={`w-full h-auto border-y-[1px] border-gray-800 ${isCreate ? "block" : "hidden"}`}>
              <h2 className="w-full py-4 pb-6 text-xl font-bold text-white">Create your playlist</h2>
              <input type="text" id="name" className="w-[calc(100%-15%)] h-12 rounded-full bg-transparent outline-none text-white border-neutral-400 border-[1px] px-4 placeholder:font-bold placeholder:text-neutral-800" placeholder="Enter a playlist name"/>
              <div className="w-full h-16 my-4 flex items-center justify-evenly">
                <li><button onClick={createPlaylist} className="w-32 h-12 rounded-full text-md font-bold border-none bg-purple-700 text-white">Create</button></li>
                <li><button onClick={toggleCreate} className="w-32 h-12 rounded-full text-md font-bold border-[1px] border-purple-500 text-purple-500 bg-transparent">Cancel</button></li>
              </div>
            </li>
          </div>
          <Link to="/home">
            <button className="w-full h-16 flex items-center border-gray-900 border-b-[1px] justify-center bg-transparent hover:bg-neutral-800">
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Home
              </p>
            </button>
          </Link>
          <Link to="/home/songslist">
            <button className="w-full h-16 flex items-center justify-center bg-transparent hover:bg-neutral-800">
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Search
              </p>
            </button>
          </Link>
          <Link to="/home/favorites">
            <button className="w-full h-16 flex items-center border-gray-900 border-y-[1px] justify-center bg-transparent hover:bg-neutral-800">
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Your Favorites
              </p>
            </button>
          </Link>
          <li>
            <button className="w-full h-16 flex items-center justify-evenly border-gray-900 border-b-[1px] bg-transparent hover:bg-neutral-800">
              <p className="font-bold pr-20 text-white text-left text-lg whitespace-nowrap">
                Your Playlists
              </p>
              <button
                onClick={showPlaylist}
                className="w-8 h-8 p-2 rounded-md bg-transparent hover:border-2">
                <img
                  src={expanded}
                  alt="inside"
                  className={`w-full h-full transform ${
                    showPlay ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </button>
            <ul
              className={`w-full mx-auto h-auto max-h-80 bg-neutral-900  ${
                showPlay ? "block" : "hidden"
              } flex flex-col items-center justify-center overflow-y-scroll`}
            >
              {libContext.yourPlaylists[0].map((playlist, index)=>
              <div 
              key={index}
              className="w-full h-12 pl-16 flex items-center justify-center hover:bg-black border-black border-b-[1px]">
              <Link
                to="/home/playlist"
                className="w-64 h-10 text-white pt-1.5 -ml-16 text-md text-left font-bold overflow-x-hidden"
              >
                {playlist.playlistName}
              </Link>
              <button 
                onClick={() => removePlaylist(index)}
                className="w-6 h-6 bg-transparent ml-6">
                  ❌
              </button>
              </div>
              )}
            </ul>
          </li>
          <li>
            <button className="w-full h-16 flex items-center justify-evenly bg-transparent hover:bg-neutral-800">
              <p className="font-bold pr-14 text-white text-left text-lg whitespace-nowrap">
                Your Followings
              </p>
              <button
                onClick={showFollowings}
                className="w-8 h-8 p-2 rounded-md bg-transparent hover:border-2"
              >
                <img
                  src={expanded}
                  alt="inside"
                  className={`w-full h-full ${
                    showFol ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </button>
            <ul
              className={`w-full mx-auto h-auto mb-10 bg-neutral-900 flex flex-col items-center justify-start overflow-y-scroll ${
                showFol ? "block" : "hidden"
              }`}
            >
              {libContext.followings[0].map((follow)=>
                <Link
                key={follow.id}
                to={`home/artist/${follow.id}`}
                className="w-full h-12 list-none pl-36 flex items-center justify-start hover:bg-black flex-shrink-0"
              >
                  <img
                    src={follow.image[0].link}
                    alt="artist-cover"
                    className="w-8 h-8 -ml-10 mr-10 rounded-full"
                  />
                  <p className="text-white font-bold">{follow.name}</p>
              </Link>
              )}
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}
