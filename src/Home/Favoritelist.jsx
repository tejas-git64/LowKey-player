import React, { useContext, useState } from "react";
import Song from "../components/Song";
import { Link } from "react-router-dom";
import back from "../assets/icons8-left-100.png"
import { AppContext } from "../App";

export default function Favoritelist() {
  const favContext = useContext(AppContext)
  let [isPlaying, setIsPlaying] = useState(false); //complete list plays

  function playFavorites() {
    setIsPlaying(!isPlaying);
    favContext.setPlayQue(favContext.favorites[0])
  }

  return (
    <>
      <div className="w-full lg:w-[calc(100%-5%)] 2xl:w-[calc(100%+44%)] mx-auto h-full top-0 left-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-neutral-800 to-black">
        <div className="w-full h-40 border-b-2 relative border-gray-700 flex justify-between items-end py-8 px-4 pr-6 bg-gradient-to-t from-black to-pink-600">
          <Link to="/home" className="w-auto h-auto right-5 top-3 absolute">
            <button className="bg-transparent border-none mr-1"><img src={back} alt="back" className="w-10 h-10"/></button>
          </Link>
          <span className="h-24 -mb-3 flex items-center">
            <h2 className="text-white text-3xl font-bold whitespace-nowrap">Your Favorites</h2>
          </span>
          <button
              onClick={playFavorites}
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
        <ul className="w-full h-[calc(100%-23%)] lg:p-4 overflow-y-scroll">
          {favContext.favorites[0].map((favorite)=><Song key={favorite.id} favorite={favorite}/>)}
        </ul>
      </div>
    </>
  );
}
