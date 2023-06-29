import React, { useEffect, useState } from "react";
import shiny from "../assets/icons8-sparkling-96.png";
import expanded from "../assets/icons8-down-96.png";
import online from "../assets/icons8-online-90.png";
import offline from "../assets/offline.png";
import { Link } from "react-router-dom";
import back from "../assets/icons8-left-100.png"

export default function UserMenu(props) {
  let [showPlay, setShowPlay] = useState(true);
  let [showFol, setShowFol] = useState(true);
  let [status, setStatus] = useState(false);

  useEffect(() => {
    window.addEventListener("online", () => {
      setStatus(window.navigator.onLine);
    });
  }, []);

  function showPlaylist(e) {
    e.preventDefault()
    setShowPlay(prev => !prev);
  }

  function showFollowings() {
    setShowFol(!showFol);
  }

  function removePlaylist(index) {
    const newArray = [...props.yourPlaylists]
    newArray.splice(index,1)
    props.setYourPlaylists(newArray)
  }

  return (
    <>
      <div
        className={`w-full lg:w-[calc(100%-50%)] xl:w-[calc(100%-60%)] relative ${
          props.isLogin || window.location.pathname === "/" ? "hidden" : "hidden lg:block"
        } h-full overflow-x-hidden overflow-y-scroll scroll-smooth`}
      >
        <img
          src="/sound-waves.png"
          alt="music-logo"
          className="w-16 h-16 m-4 ml-6"
        />
        <Link to="/home" className="w-auto h-auto absolute right-5 top-7 block md:hidden">
            <button className="bg-transparent border-none"><img src={back} alt="back" className="w-10 h-10"/></button>
        </Link>
        <ul className="w-full h-[calc(100vh-15vh)] overflow-y-hidden lg:flex flex-col mt-6 justify-start border-zinc-300">
          <li className="w-full mt-6 mb-4">
            <button 
            onClick={()=>props.setIsCreating(prev => !prev)}
            className="w-full h-16 flex items-center justify-evenly bg-purple-800 hover:bg-purple-700">
              <p className="font-bold text-white text-lg ml-7 whitespace-nowrap">
                Create new playlist
              </p>
              <img src={shiny} alt="new" className="w-6 h-6 mx-6 ml-16" />
            </button>
          </li>
          <Link to="/home">
            <button className="w-full h-14 flex items-center justify-start bg-transparent hover:bg-neutral-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className="lg:w-6 lg:h-6 mx-8 xl:ml-10 xl:mr-10 invert"
              >
                <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
              </svg>
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Home
              </p>
            </button>
          </Link>
          <Link to="/home/songslist">
            <button className="w-full h-14 flex items-center justify-start bg-transparent hover:bg-neutral-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="lg:w-6 lg:h-6 mx-8 xl:ml-[40px] xl:mr-10 invert"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Search
              </p>
            </button>
          </Link>
          <Link to="/home/favorites">
            <button className="w-full h-14 flex items-center justify-start bg-transparent hover:bg-neutral-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="lg:w-[25px] lg:h-[25px] mx-8 xl:ml-[38px] xl:mr-10 invert"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </svg>
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Your Favorites
              </p>
            </button>
          </Link>
          <li>
            <div className="w-full h-14 flex items-center justify-start bg-transparent hover:bg-neutral-800">
              <svg
                fill="#000"
                width="100px"
                height="100px"
                viewBox="0 0 24.00 24.00"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000"
                strokeWidth="0.00024000000000000003"
                className="lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-8 xl:ml-10 xl:mr-9 invert"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#CCCCCC"
                  strokeWidth="0.096"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M13 16.493C13 18.427 14.573 20 16.507 20s3.507-1.573 3.507-3.507c0-.177-.027-.347-.053-.517H20V6h2V4h-3a1 1 0 0 0-1 1v8.333a3.465 3.465 0 0 0-1.493-.346A3.51 3.51 0 0 0 13 16.493zM2 5h14v2H2z"></path>
                  <path d="M2 9h14v2H2zm0 4h9v2H2zm0 4h9v2H2z"></path>
                </g>
              </svg>
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Your Playlists
              </p>
              <button
                onClick={showPlaylist}
                className="w-8 h-8 p-2 rounded-md bg-transparent hover:border-2 ml-9 xl:ml-20"
                
              >
                <img
                  src={expanded}
                  alt="inside"
                  className={`w-full h-full transform ${
                    showPlay ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>
            <ul
              className={`w-full mx-auto h-auto max-h-80 bg-neutral-900 ${
                showPlay ? "block" : "hidden"
              } flex flex-col items-center justify-center overflow-y-scroll`}
            >
              {props.yourPlaylists.map((playlist, index)=>
              <div 
              key={index}
              className="w-full h-12 pl-16 flex items-center transition-all ease-in-out delay-35 justify-start hover:bg-black border-black border-b-[1px]">
                <Link
                  key={playlist.id}
                  to={`/home/userplaylist/${playlist.playlistName}`}
                  className="w-52 h-10 text-white pt-1.5 text-md text-left font-bold overflow-x-hidden"
                >
                  {playlist.playlistName}
                </Link>
                <button 
                  onClick={() => removePlaylist(index)}
                  className="w-6 h-6 bg-transparent ml-4">
                    ❌
                </button>
              </div>
              )}
            </ul>
          </li>
          <li>
            <div className="w-full h-14 flex items-center justify-start bg-transparent hover:bg-neutral-800">
              <svg
                width="100px"
                height="100px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lg:w-6 lg:h-6 xl:w-7 xl:h-7 ml-8 mr-8 xl:ml-10 xl:mr-9 invert"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M18 18.86H17.24C16.44 18.86 15.68 19.17 15.12 19.73L13.41 21.42C12.63 22.19 11.36 22.19 10.58 21.42L8.87 19.73C8.31 19.17 7.54 18.86 6.75 18.86H6C4.34 18.86 3 17.53 3 15.89V4.97998C3 3.33998 4.34 2.01001 6 2.01001H18C19.66 2.01001 21 3.33998 21 4.97998V15.89C21 17.52 19.66 18.86 18 18.86Z"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M12.28 14.96C12.13 15.01 11.88 15.01 11.72 14.96C10.42 14.51 7.5 12.66 7.5 9.51001C7.5 8.12001 8.62 7 10 7C10.82 7 11.54 7.39 12 8C12.46 7.39 13.18 7 14 7C15.38 7 16.5 8.12001 16.5 9.51001C16.49 12.66 13.58 14.51 12.28 14.96Z"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
              <p className="font-bold text-white text-lg whitespace-nowrap">
                Your Followings
              </p>
              <button
                onClick={showFollowings}
                className="w-8 h-8 p-2 rounded-md bg-transparent hover:border-2 ml-3 xl:ml-14"
              >
                <img
                  src={expanded}
                  alt="inside"
                  className={`w-full h-full ${
                    showFol ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>
            <ul
              className={`w-full mx-auto h-auto max-h-80 bg-neutral-900 flex flex-col items-center justify-start overflow-y-scroll ${
                showFol ? "block" : "hidden"
              }`}
            >
              {props.followings.map((follow)=>
              <Link
                to={`home/artist/${follow.id}`}
                key={follow.id}
                className="w-full h-12 border-black border-b-[1px] transition-all ease-in delay-25 hover:bg-black pl-10 flex items-center justify-start"
              >
                  <img
                    src={follow.image ? follow.image[0].link : ""}
                    alt="cover"
                    className="w-8 h-8 mr-6 rounded-full"
                  />
                  <p className="text-white font-bold">{follow.name}</p>
              </Link>
              )}
            </ul>
          </li>
        </ul>
        <div
          className={`w-full h-12 absolute bottom-[60px] pl-6 left-0 transition-all ease-in delay-75 ${
            status ? "bg-green-500" : "bg-red-500"
          } flex items-center justify-between`}
        >
          <p className="font-bold whitespace-nowrap text-md xl:text-lg text-white">Network status:</p>
          <div className="w-40 h-14 px-6 left-0 flex items-center justify-evenly">
            <p className="font-bold text-md xl:text-lg pr-2 text-white">
              {status ? "online" : "offline"}
            </p>
            <img
              src={status ? online : offline}
              alt="status"
              className="w-4 h-4 lg:w-6 lg:h-6"
            />
          </div>
        </div>
      </div>
    </>
  );
}
