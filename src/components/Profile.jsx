import React, { useContext } from "react";
import back from "../assets/icons8-left-100.png"
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";

export default function Profile() {

  const profileContext = useContext(AppContext)
  const navigate = useNavigate()

  function removeUser() {
    localStorage.clear()
  }
  
  function signOut() {
    removeUser()
    navigate("/login");
    window.location.reload();
  }
  
  return (
    <>
      <div className="w-full xl:w-[calc(100%+6%)] h-[calc(100%-0%)] relative overflow-y-scroll bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-900 to-neutral-600">
        <h2 className="w-full h-auto text-3xl font-bold text-white p-6 px-10 text-left md:text-left">
          Your Profile
        </h2>
        <Link to="/home" className="w-auto h-auto top-6 right-10 md:right-8 md:top-4 absolute">
            <button className="bg-transparent border-none"><img src={back} alt="back" className="w-10 h-10 md:w-12 md:h-12"/></button>
        </Link>
        <div className="w-full h-auto mt-10">
          <ul className="w-full xl:h-48 flex flex-col xl:flex-row items-start xl:items-center justify-evenly">
            <li className="ml-10 xl:ml-0 list-none">
              <img
                src={profileContext.avatar}
                alt="user-img"
                className="w-40 h-40 border-2 border-purple-600 rounded-full"
              />
            </li>
            <li className="w-96 h-full mx-8 mt-6 xl:mt-8 xl:mx-0 xl:ml-20 list-none">
              <div className="w-full h-full">
                <ul className="w-full h-full ml-1 xl:ml-0 flex flex-col items-center justify-evenly p-2">
                  <li className="w-full flex flex-col my-3">
                    <label
                      htmlFor="text"
                      className="text-left text-white font-semibold mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={profileContext.profile ? profileContext.profile.name : undefined}
                      className="w-80 md:w-full h-10 text-white rounded-md bg-neutral-700 px-3"
                      placeholder="Name"
                    />
                  </li>
                  <li className="w-full flex flex-col my-3">
                    <label
                      htmlFor="email"
                      className="text-left text-white font-semibold mb-2"
                    >
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={profileContext.profile ? profileContext.profile.email : undefined}
                      className="w-80 md:w-full h-10 text-white rounded-md bg-neutral-700 px-3"
                      placeholder="Email address"
                    />
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <ul className="w-full h-auto mt-0 flex flex-col items-center justify-evenly p-2 px-4 ml-3 xl:ml-0 xl:px-[140px]">
            <li className="w-full flex flex-col my-3 px-4 pr-6">
              <label
                htmlFor=""
                className="text-left text-white font-semibold mb-2"
              >
                Something about yourself
              </label>
              <textarea
                type="text"
                className="w-80 md:w-full h-20 text-white rounded-md outline-none bg-neutral-700 px-3"
              />
            </li>
            <li className="w-full flex flex-col my-3 px-4">
              <label
                htmlFor=""
                className="text-left text-white font-semibold mb-2"
              >
                Location
              </label>
              <input
                type="text"
                value={profileContext.profile ? profileContext.profile.location : undefined}
                className="w-80 md:w-56 h-10 text-white rounded-md bg-neutral-700 px-3"
              />
            </li>
            <li className="w-full flex flex-col my-3 px-4">
            <label
                htmlFor=""
                className="text-left text-white font-semibold mb-2"
              >
                Gender
              </label>
              <input
                type="text"
                value={profileContext.profile ? profileContext.profile.gender : undefined}
                className="w-80 md:w-56 h-10 text-white rounded-md bg-neutral-700 px-3"
              />
            </li>
            <button 
            onClick={signOut}
            className="w-44 h-14 mt-12 -ml-4 mb-52 xl:mb-0 xl:mt-32 bg-green-500 font-bold text-lg text-white rounded-full">
              Sign out
            </button>
          </ul>
        </div>
      </div>
    </>
  );
}
