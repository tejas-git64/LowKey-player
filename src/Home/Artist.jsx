import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Song from "../components/Song";
import back from "../assets/icons8-left-100.png"
import follow from "../assets/icons8-add-user-male-64.png"
import followed from "../assets/icons8-checked-user-male-48.png"
import { AppContext } from "../App";

export default function Artist() {
  let artistData;
  let albumData;
  let songsData;
  let { artistId } = useParams()
  let [isFollowed, setFollowed] = useState(false)
  let artistContext = useContext(AppContext)

  let [artist, setArtist] = useState({
      id: "",
      name: "",
      image: [{
        link: ""
      },{},{}],
      wiki: "",
  })

  let [arAlbum, setArAlbum] = useState([{
    id: "",
    name: "",
    image: [{
      link: ""
    },{},{}],
    primaryArtists: []
  }])

  let [arsongs, setArSongs] = useState([])
  // console.log(artist);
  // console.log(arsongs);
  // console.log(arAlbum);

  function toggleFollow() {
    if(artistContext.followings[0].some(maker => maker.name === artist.name)) {
      setFollowed(prev => !prev)
      artistContext.followings[1](artistContext.followings[0].filter(
        a => a.id !== artist.id
      ))
    } else {
      setFollowed(prev => !prev)
      artistContext.followings[1](prev => [
        artist,
        ...prev
      ])
    }
  }

  async function getArtist() {
    const artist = await fetch(`https://saavn.me/artists?id=${artistId}`);
    artistData = await artist.json();
    setArtist(artistData.data);
  }
  async function getArAlbum() {
    const album = await fetch(`https://saavn.me/artists/${artistId}/albums?category=alphabetical`);
    albumData = await album.json();
    setArAlbum(albumData.data.results);
  }
  async function getArSongs() {
    const songs = await fetch(`https://saavn.me/artists/${artistId}/songs?category=latest`);
    songsData = await songs.json();
    setArSongs(songsData.data.results);
  }

  useEffect(()=>{
    getArtist()
    getArAlbum()
    getArSongs()
  },[artistId])

  return (
    <>
      <div className="w-full h-full xl:w-[calc(100%+44%)] bg-transparent overflow-y-scroll bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-neutral-800 to-black">
        {/* Albums */}
        <div className="w-full h-52 relative flex justify-between items-end px-2 bg-gradient-to-r from-black via-neutral-800 to-neutral-700">
        <Link to="/home" className="w-auto h-auto right-5 top-3 absolute">
            <button className="bg-transparent border-none mr-1"><img src={back} alt="back" className="w-10 h-10"/></button>
        </Link>
          <span className="w-auto h-auto -mt-6 lg:w-96 xl:w-[calc(100%-25%)] 2xl:w-[calc(100%-20%)] p-4 flex flex-col items-start justify-evenly lg:flex-row lg:items-center lg:justify-start">
            <img src={artist.image[2].link || ""} alt="playlist-image" className="w-28 h-28 lg:w-40 lg:h-40 lg:mb-2 mb-4 rounded-md ml-2 mr-5"/>
            <h2 className="w-32 md:w-auto h-auto ml-2 pb-2 text-white text-left text-base md:text-xl lg:text-3xl font-bold overflow-x-hidden whitespace-pre-line lg:whitespace-nowrap">{artist.name}</h2>
          </span>
          <span className="w-auto h-auto p-4 pr-3 flex items-center lg:flex-row lg:justify-between">
            <a href="#" className="w-28 h-10 ml-2 font-bold pt-2 bg-transparent text-white rounded-md">
              More info
            </a>
            <button 
            onClick={toggleFollow}
            className="w-auto mx-2 bg-transparent bg-white rounded-lg">
              <img src={isFollowed ? followed : follow } alt="follow-artist" className="w-10 h-10 md:w-12 md:h-12 p-2 invert transition-all ease-in-out delay-75" />
            </button>
          </span>
        </div>
        <div className="w-full h-auto flex flex-col my-4">
          <div
            className="w-full h-[300px] lg:h-72 my-2 -mb-10 md:mb-4 bg-transparent overflow-x-hidden flex flex-col"
          >
            <h1 className="text-2xl xl:text-3xl text-left font-bold text-white px-6 mb-4">
              Albums
            </h1>
            <ul className="w-full lg:w-[1225px] h-52 lg:h-64 whitespace-nowrap p-4 px-0 lg:px-5 flex overflow-x-scroll overflow-y-hidden">
              {arAlbum.map((album)=>
              <Link
                key={album.id}
                to={`/home/album/${album.id}`}
                className="w-48 h-auto lg:mr-14 px-4 lg:w-[170px] lg:h-44 list-none flex flex-col items-center flex-shrink-0 whitespace-normal"
              >
                  <img
                    src={album.image[2].link}
                    alt="user-profile"
                    className="w-32 h-36 xl:w-40 xl:h-44"
                  />
                  <p className="text-white text-sm md:text-base font-bold xl:font-semibold mt-1">
                    {album.name}
                  </p>
              </Link>
              )}
            </ul>
          </div>
          {/* Playlists */}
        </div>
        <div className="w-full h-auto p-2 md:p-3 pt-0">
          <h2 className="text-white text-2xl lg:text-3xl font-bold text-left p-4 pt-2">
            Soundtracks
          </h2>
          <ul className="w-full h-[900px] py-2 md:p-4 overflow-y-scroll scroll-smooth">
            {arsongs.map((arsong)=><Song key={arsong.id} arsong={arsong} />)}
          </ul>
        </div>
      </div>
    </>
  );
}
