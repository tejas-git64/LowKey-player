import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SongsinRecent(props) {
  let [play, setPlay] = useState(false); //Song play state 
  let [song, setSong] = useState({
      id: "", 
      name: "", 
      album: {
        id: "",
        name: "",
        url: ""
      },
      downloadUrl: [{}],
      duration: "",
      image: [{},{},{
        link: ""
      }],
      primaryArtists: "",
      primaryArtistsId: "",
      releaseDate: "",
      year: ""
  }) //Song details state

  function playSong() {
    if(play === false) {
      props.setNowPlaying(song)
      setPlay(prev => !prev)
    } else {
      setPlay(prev => !prev)
    }
  }

  function prepareSong() {
    setSong({
      id: props.recent.id, 
      name: props.recent.name, 
      downloadUrl: [{}],
      duration: props.recent.duration,
      image: props.recent.image[0].link,
      primaryArtists: props.recent.primaryArtists,
      primaryArtistsId: props.recent.primaryArtistsId,
      year: props.recent.year
  })
  }

  useEffect(()=>{
    if(props.recent) {
      prepareSong()
    }
  },[])

  // console.log(props.recent)

  return (
    <>
      <li 
      className="w-full h-16 border-b-[1px] border-gray-900 flex items-center">
      <span className="w-[calc(100%-20%)] h-full p-2 pt-1.5 flex items-center">
        <img
          src={song.image}
          alt="cover-art"
          className="w-10 h-10 mx-3 mr-2"
        />
        <div className="w-48 px-2 flex flex-col items-start justify-center">
          <h3 className="text-left text-white font-semibold whitespace-nowrap overflow-x-clip">
            {song.name}
          </h3>
          <Link to={`/home/artist/${song.primaryArtistsId}`} className="text-left text-sm text-neutral-500 whitespace-nowrap overflow-x-clip">{song.primaryArtists}</Link>
        </div>
      </span>
      {/* <button
        onClick={playSong}
        className="w-10 h-10 bg-black px-3 ml-2"
      >
        {play ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="w-4 h-4 -ml-0.1 invert"
          >
            <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="w-4 h-4 invert"
          >
            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
          </svg>
        )}
      </button> */}
    </li>
    </>
  );
}
