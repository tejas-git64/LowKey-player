import React from "react";
import { Link } from "react-router-dom";
import home from "../assets/icons8-home-24.png"
import search from "../assets/icons8-search-64.png"
import library from "../assets/icons8-layers-48.png"
import user from "../assets/icons8-user-48.png"

export default function MobileMenu() {
    
    return (
      <>
        <div className="w-full h-16 fixed bottom-0 z-30 lg:hidden bg-black">
          <ul className=" w-full h-full flex items-center justify-evenly">
            <li>
              <Link to="/home" className="flex flex-col items-center p-2">
                <img src={home} alt="home" className="w-6 h-6"/>
                <p className="text-white font-semibold text-[12px]">Home</p>
              </Link>
            </li>
            <li>
              <Link
                to="/home/songslist"
                className="flex flex-col items-center p-2"
              >
                <img src={search} alt="home" className="w-6 h-6"/>
                <p className="text-white font-semibold text-[12px]">Search</p>
              </Link>
            </li>
            <li>
              <Link
                to="/home/library"
                className="flex flex-col items-center p-2"
              >
                <img src={library} alt="home" className="w-6 h-6"/>
                <p className="text-white font-semibold text-[12px]">Library</p>
              </Link>
            </li>
            <li>
              <Link
                to="/home/profile"
                className="flex flex-col items-center p-2"
              >
                <img src={user} alt="home" className="w-6 h-6"/>
                <p className="text-white font-semibold text-[12px]">Profile</p>
              </Link>
            </li>
          </ul>
        </div>
      </>
    );
}