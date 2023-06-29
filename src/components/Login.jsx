import React, { useEffect, useState } from "react";
import logo from "/sound-waves.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [pass, setPass] = useState("")
  let [location,setLocation] = useState("")
  let [gender, setGender] = useState("")
  
  const user = {
    name: name,
    email: email,
    password: pass,
    location: location,
    gender: gender
  }

  function saveUser() {
    localStorage.setItem('user', JSON.stringify(user))
  }

  function navigateHome() {
    saveUser()
    navigate("/home");
  }


  return (
    <>
      <div
        style={{
          backgroundImage:
            "linear-gradient(90deg, #6200ff5f, #0000006e), url('https://i.pinimg.com/originals/94/75/0f/94750fc34418a7e114399c16b398fb2a.jpg')",
        }}
        className="w-full h-screen p-4 bg-center bg-cover bg-no-repeat overflow-hidden flex items-center justify-center"
      >
        <div className="w-[calc(100%-10%)] h-[calc(100svh-15svh)] mt-16 md:mt-0 sm:w-4/6 sm:h-3/4 md:w-3/6 lg:w-3/6 xl:w-4/6 p-0 absolute m-auto bg-white flex items-center rounded-xl">
          <Link to="/">
            <img
              src={logo}
              alt="app-logo"
              className="w-18 h-18 fixed top-5 left-5 rounded-full shadow-2xl bg-black"
            />
          </Link>
          <div className="w-[calc(100%+30%)] h-full hidden xl:flex items-center justify-center bg-gradient-to-l from-purple-300 to-red-300 animate-colorWave rounded-l-md bg-center bg-cover bg-no-repeat">
            <h1 className="font-extrabold bg-transparent text-white xl:text-5xl animate-none xl:leading-relaxed 2xl:text-6xl 2xl:leading-snug px-14 text-left">
              Listen to the latest and greatest of soundtracks that rhyme with
              your JAM !!!
            </h1>
          </div>
          {/* Sign up page */}
          <form
            action=""
            className="w-full h-full mx-auto xl:w-[calc(100%-40%)] px-8 xl:px-10 relative overflow-clip flex flex-col justify-center"
          >
            <h2 className="text-purple-500 text-2xl md:text-3xl -mt-4 mb-10 xl:mb-12 font-bold">
              Join the community
            </h2>
            <label
              htmlFor="name"
              className="text-gray-500 text-md text-left font-semibold mb-1"
            >
              Enter your full name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              className="border-2 w-full p-2 mb-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
              placeholder="Enter your name"
            />
            <label
              htmlFor="email"
              className="text-gray-500 text-md text-left font-semibold mb-1"
            >
              Enter email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 w-full p-2 mb-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
              placeholder="Enter your email"
            />
            <label
              htmlFor="password"
              className="text-gray-500 text-md text-left font-semibold mb-1"
            >
              Enter your password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPass(e.target.value)}
              className="border-2 w-full p-2 mb-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
              placeholder="Create a strong password"
            />
            <label
              htmlFor="location"
              className="text-gray-500 text-md text-left font-semibold mb-1"
            >
              Enter your Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              onChange={(e) => setLocation(e.target.value)}
              className="border-2 w-full p-2 mb-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
              placeholder="Where do you stay?"
            />
            <h2
              className="text-gray-500 text-md text-left font-semibold mb-1"
            >
              Gender
            </h2>
            <div className="">
              <div className="w-auto mb-2 flex flex-row items-center">
                <input
                type="radio"
                name="gender"
                id="male"
                value="male"
                onChange={(e) => setGender(e.target.value)}
                className="w-4 mb-0.5 mr-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
                />
                <label
                  htmlFor="male"
                  className="text-gray-400 text-md text-left font-semibold mb-1"
                >
                Male
                </label>
              </div>
              <div className="w-auto mb-2 flex flex-row items-center">
                <input
                type="radio"
                name="gender"
                id="female"
                value="female"
                onChange={(e) => setGender(e.target.value)}
                className="w-4 mb-0.5 mr-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
                />
                <label
                  htmlFor="female"
                  className="text-gray-400 text-md text-left font-semibold mb-1"
                >
                Female
                </label>
              </div>
              <div className="w-auto mb-2 flex flex-row items-center">
                <input
                type="radio"
                name="gender"
                id="prefer not to say"
                value="prefer not to say"
                onChange={(e) => setGender(e.target.value)}
                className="w-4 mb-0.5 mr-4 border-gray-100 rounded-md text-black placeholder:text-gray-300 font-semibold"
                />
                <label
                  htmlFor="prefer not to say"
                  className="text-gray-400 text-md text-left font-semibold mb-1"
                >
                Prefer not to say
                </label>
              </div>
            </div>
            <button
              onClick={navigateHome}
              type="submit"
              className="w-full h-[50px] text-white text-lg sm:h-[50px] mt-4 mx-auto text-md border-none transition-all ease-in-out delay-25 rounded-lg bg-purple-600 font-bold hover:bg-purple-700 hover:shadow-purple-300 hover:shadow-lg"
            >
              Try LowKey 🎧✨
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
