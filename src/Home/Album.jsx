import React, {useEffect, useState, useRef, useContext} from "react";
import Song from "../components/Song";
import back from "../assets/icons8-left-100.png"
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../App";

export default function Album() {
  let [isPlaying, setIsPlaying] = useState(false); //complete list plays
  let artists = useRef([""])
  let artistsIds = useRef([''])
  let albumContext = useContext(AppContext)
  let [album, setAlbum] = useState({
    image: [{},{},{}] || "",
    name: "",
    primaryArtists: "",
    songs: [] || undefined,
    primaryArtists: "",
    primaryArtistsId: ""
  })

  let albumData;
  const { albumid } = useParams();
  const refs = album.songs ? album.songs.map(() => ({ref: React.createRef()})) : [{}]
  const ids = album.songs ? album.songs.map((song) => ({id: song.id})) : [{}]

  function playAlbum() {
    setIsPlaying(!isPlaying);
    albumContext.setPlayQue(album.songs)
  }
  // console.log(albumid);

  async function getAlbum() {
    const music = await fetch(`https://saavn.me/albums?id=${albumid}`);
    albumData = await music.json();
    setAlbum(albumData.data);
  }
  // console.log(album)

  useEffect(()=>{ 
    getAlbum()
  },[])
  artistsIds.current = album.primaryArtistsId ? album.primaryArtistsId.toString().split(',') : "";
  artists.current = album.primaryArtists ? album.primaryArtists.toString().split(',') : [];
  // console.log(album);

  return (
    <>
      <div className="w-full xl:w-[calc(100%+44%)] mx-auto h-full top-0 left-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-neutral-800 to-black">
        <div className="w-full h-auto relative border-b-2 border-gray-700 flex justify-between items-end py-8 px-4 pr-6 bg-gradient-to-t from-black to-yellow-400">
        <Link to="/home" className="w-auto h-auto right-5 top-3 absolute">
            <button className="bg-transparent border-none mr-1"><img src={back} alt="back" className="w-10 h-10"/></button>
        </Link>
          <span className="w-auto h-auto -mt-3 lg:w-96 xl:w-[calc(100%-25%)] 2xl:w-[calc(100%-20%)] flex flex-col items-start lg:flex-row lg:items-center lg:justify-start lg:float-left">
            <img src={album.image[2].link} alt="playlist-image" className="w-28 h-28 lg:w-32 lg:h-32 ml-2 lg:mr-2"/>
            <div className="w-56 h-auto md:h-24 lg:h-32 md:w-full p-2 flex flex-col items-start overflow-x-hidden justify-center">
              <h2 className="w-auto h-auto text-white text-xl text-left lg:text-3xl font-bold whitespace-nowrap overflow-hidden lg:whitespace-nowrap">{album.name}</h2>
              <div className="h-auto w-auto md:w-[300px] lg:w-[350px] lg:-mr-0 xl:w-[400px] xl:-mr-0 2xl:w-[450px] flex flex-col lg:flex-row justify-start">
              {artistsIds.current ? artistsIds.current.map((artistId, index)=>
                <Link key={artistId} to={`/home/artist/${artistId.trim()}`} className="w-32 2xl:w-full h-auto md:pb-2 mr-1 text-black text-left text-lg lg:text-xl font-bold overflow-clip whitespace-nowrap">{artists.current[index].trim()}</Link> 
              ) : artists.current.map((index) =>
                <p key={index} id="name" className="w-auto text-left text-sm text-neutral-500 whitespace-nowrap overflow-x-hidden">{index}</p>
              )}
              </div>
            </div>
          </span>
            <button
              onClick={playAlbum}
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
        <ul className="w-full h-[calc(100%-20%)] py-2 md:p-4 overflow-y-scroll scroll-smooth">
          {album.songs.map((asong,i)=><Song asong={asong} re={refs[i].ref} ke={ids[i].id} />)}
        </ul>
      </div>
    </>
  );
}
