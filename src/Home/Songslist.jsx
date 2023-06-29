import React, {useEffect, useState} from "react";
import Song from "../components/Song";
import { Link } from "react-router-dom";
import back from "../assets/icons8-left-100.png"

export default function Songslist() { 
  let [isPlaying, setIsPlaying] = useState(false); //complete list plays
  let [songSong, setSsPlay] = useState(false) //individual song plays
  let [query, setQuery] = useState("")
  const songsPage = document.getElementById('songsPage')
  const artistsPage = document.getElementById('artistsPage')
  const albumsPage = document.getElementById('albumsPage')
  const playlistsPage = document.getElementById('playlistsPage')
  // Displaying on button click
  const searchPages = [songsPage,artistsPage,albumsPage,playlistsPage]
  let [results, setResults] = useState({
    albums: {
      results: [{
        id: "",
        title: "",
        artist: "",
        image: [{},{},{
          link: ""
        }]
      }]
    },
    artists: {
      results: [{
        id: "",
        title: "",
        image: [{},{},{
          link: ""
        }]
      }]
    },
    playlists: {
      results: [{
        id: "",
        title: "",
        image: [{},{},{
          link: ""
        }]
      }]
    },
    songs: {
      results: [{
        id: "",
        image: [{},{},{
          link: ""
        }],
        primaryArtists: "",
        title: "",
        url: ""
      }]
    },
    topQuery: {
      results: []
    }
})
  
  function showPage(page) {
    switch(true) {
      case page === "songsPage":
        searchPages[0].classList.hasOwnProperty('hidden') ? searchPages[0].classList.remove('hidden') :
        searchPages[0].classList.add('hidden')
      break;
      case page === "artistsPage":
        searchPages[1].classList.hasOwnProperty('hidden') ? searchPages[1].classList.remove('hidden') :
          searchPages[1].classList.add('hidden')
      break;
      case page === "albumsPage":
        searchPages[2].classList.hasOwnProperty('hidden') ? searchPages[2].classList.remove('hidden') :
          searchPages[2].classList.add('hidden')
      break;
      case page === "playlistsPage":
        searchPages[3].classList.hasOwnProperty('hidden') ? searchPages[3].classList.remove('hidden') :
          searchPages[3].classList.add('hidden')
      break;
      case 'default':
        return
    }
  }

  async function getSearchData() {
    let data = await fetch(`https://saavn.me/search/all?query=${query}`)
    let json = await data.json()
    setResults(json.data);
  }

  useEffect(()=>{
    getSearchData()
    // console.log(results);
  },[query])

  return (
    <>
      <div className="w-full lg:w-full xl:w-[calc(100%-10%)] 2xl:w-[calc(100%+45%)] relative mx-auto h-full bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-neutral-800 to-black">
        <div className="w-full h-28 bg-neutral-800 border-black border-b-[1px] flex flex-col items-center justify-center p-4 md:p-8 py-4">
          <Link to="/home" className="w-auto h-auto right-4 md:right-6 top-2 absolute">
            <button className="bg-transparent border-none mr-1"><img src={back} alt="back" className="w-8 h-8"/></button>
          </Link>
          <span className="w-full flex items-center mt-10 mb-2 justify-evenly">
            <input
              type="search"
              name="search"
              id="search"
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 bg-black p-4 text-white outline-none placeholder:font-semibold placeholder:text-neutral-400 placeholder:text-md rounded-l-full"
              placeholder="Search for songs, artists, albums, playlists"
            />
            <button className="w-12 h-10 px-3 bg-black rounded-r-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-5 h-5 invert-[0.6]"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </button>
          </span>
        </div>
        <ul className="w-full h-[calc(100%-23%)] overflow-y-scroll">
          <div id="songsPage" className="w-full h-auto px-10 mt-4">
            <h2 className="h-14 text-left py-3 mb-4 text-xl text-neutral-600 font-bold">Songs</h2>
            {results ? results.songs.results.map((song)=><Song key={song.id} ssong={song} />) : ""}
          </div>
          <div id="artistsPage" className="w-full h-auto py-4">
            <h2 className="h-14 text-left py-3 mb-4 px-10 text-xl text-neutral-600 font-bold">Artists</h2>
            {results ? results.artists.results.map(artist => 
              <Link key={artist.id} to={`/home/artist/${artist.id}`} className="w-full h-14 my-2 ml-16 flex items-center justify-start">
                <img src={artist.image[2].link} alt={artist.title} className="w-10 h-10 rounded-full mr-6" />
                <h2 className="text-lg text-left text-white font-semibold">{artist.title}</h2>
              </Link>  
            ) : ""}
          </div>
          <div id="albumsPage" className="w-full h-auto py-4">
            <h2 className="h-14 text-left py-3 mb-4 px-10 text-xl text-neutral-600 font-bold">Albums</h2>
            {
              results ? results.albums.results.map((album)=>
              <Link key={album.id} to={`/home/album/${album.id}`} className="w-full h-auto py-2 mb-2 md:mb-6 px-16 flex items-center justify-start">
                <img src={album.image[2].link} alt={album.title} className="w-20 h-20 rounded-md mr-6" />
                <div className="w-96 whitespace-nowrap overflow-x-hidden">
                  <h2 className="text-lg text-left text-white font-semibold">{album.title}</h2>
                  <p className="text-sm text-left text-neutral-700 font-medium">{album.artist}</p>
                </div>
              </Link>
              ) : ""
            }
          </div>
          <div id="playlistsPage" className="w-full h-auto py-4">
            <h2 className="h-14 text-left py-3 mb-4 px-10 text-xl text-neutral-600 font-bold">Playlists</h2>
          {
              results ? results.playlists.results.map((playlist)=>
              <Link key={playlist.id} to={`/home/playlist/${playlist.id}`} className="w-full h-auto py-2 my-2 md:mb-6 px-16 flex items-center justify-start">
                <img src={playlist.image[2].link} alt={playlist.title} className="w-20 h-20 rounded-md mr-6" />
                <h2 className="text-lg text-left text-white font-bold">{playlist.title}</h2>
              </Link>
              ) : ""
            }
          </div>
        </ul>
      </div>
    </>
  );
}
