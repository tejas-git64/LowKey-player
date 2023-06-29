import React from "react";
import reactlogo from "../assets/icons8-react-native-48.png";
import tailwindlogo from "../assets/icons8-tailwindcss-48.png";
import { Link, useNavigate } from "react-router-dom";

export default function Intro() {
	const navigate = useNavigate();

	function toHome() {
		navigate("/home");
	}

	return (
		<>
			<div className='w-full h-full flex items-center bg-[url(https://wallpaperaccess.com/full/2361576.jpg)] bg-no-repeat bg-center bg-cover'>
				<div className='w-[calc(100%-10%)] md:w-[calc(100%-40%)] relative mx-auto rounded-lg h-auto bg-neutral-900 flex flex-col items-center -mt-4'>
					<h1
						style={{
							textShadow: "0px 3px 5px purple",
						}}
						className='text-3xl xl:text-4xl font-bold text-purple-500 my-6 mb-2 text-center'
					>
						Welcome to LowKey
					</h1>
					<ul className='w-[calc(100%-20%)] h-auto px-6 my-4 border-black md:mt-4 border-[1px] rounded-lg'>
						<h2 className='text-left py-4 text-xl md:text-2xl text-white font-bold'>
							Features ✨
						</h2>
						<li className='my-2'>
							<p className='text-white text-md md:text-xl mb-3 font-mono font-bold text-left'>
								👉 - Songs from different artists/albums/playlists 🎶
							</p>
						</li>
						<li className='my-2'>
							<p className='text-white text-md md:text-xl mb-3 font-mono font-bold text-left'>
								👉 - Search across various artists/albums/playlists 🔍
							</p>
						</li>
						<li className='my-2'>
							<p className='text-white text-md md:text-xl mb-3 font-mono font-bold text-left'>
								👉 - Can create favorites/add songs to favorites ➕🎶
							</p>
						</li>
						<li className='my-2'>
							<p className='text-white text-md md:text-xl mb-3 font-mono font-bold text-left'>
								👉 - Recent listening history support 📃
							</p>
						</li>
						<li className='my-2'>
							<p className='text-white text-md md:text-xl mb-3 font-mono font-bold text-left'>
								👉 - Activity support 🔔
							</p>
						</li>
					</ul>
					<ul className='w-[calc(100%-20%)] h-auto'>
						<li>
							<p className='w-full h-auto text-left py-1 text-md md:text-lg pl-4 text-white font-semibold'>
								Inspired by Spotify 💫
							</p>
						</li>
						<li>
							<p className='w-full h-auto text-left py-1 text-md md:text-lg pl-4 text-white font-semibold'>
								Made possible by
								<a href='https://docs.saavn.me' className='pl-2'>
									JioSaavn API
								</a>
							</p>
						</li>
					</ul>
					<div className='w-[calc(100%-20%)] h-auto p-4 pt-0'>
						<h2 className='text-left mt-2 py-2 text-md md:text-xl text-white font-bold'>
							Technologies used 🛠️
						</h2>
						<div className='flex'>
							<p className='w-auto mr-10 h-auto text-left flex items-center py-1 text-sm md:text-lg md:pl-2 text-white font-bold'>
								React
								<img src={reactlogo} className='w-6 h-6 ml-3' alt='react' />
							</p>
							<p className='w-auto mr-10 h-auto text-left flex items-center py-1 text-sm md:text-lg md:pl-2 text-white font-bold'>
								Tailwindcss
								<img src={tailwindlogo} className='w-6 h-6 ml-3' alt='react' />
							</p>
							<p className='w-auto mr-10 h-auto text-left flex items-center py-1 text-sm md:text-lg md:pl-2 text-white font-bold'>
								Vite
								<img src='/vite.svg' className='w-6 h-6 ml-3' alt='react' />
							</p>
						</div>
					</div>
					<div className='w-full h-auto my-6 md:my-4 flex items-center justify-center md:justify-evenly'>
						<Link
							to='/home'
							onClick={toHome}
							className='w-32 lg:w-48 hover:text-black text-sm h-10 leading-6 lg:h-14 pt-2 lg:pt-3.5 text-black md:text-lg font-bold whitespace-nowrap border-none bg-purple-800 rounded-full'
						>
							Check it out
						</Link>
						<p className='px-2 md:px-6 text-neutral-600'> or </p>
						<Link
							to='/login'
							className='w-32 lg:w-48 hover:text-purple-600 text-sm h-10 leading-6 lg:h-14 pt-1.5 lg:pt-3 text-purple-600 md:text-lg font-bold whitespace-nowrap bg-transparent  rounded-full border-2 border-purple-700'
						>
							Sign Up
						</Link>
					</div>
					<footer className='w-full h-auto border-black border-t-[1px] mt-4'>
						<p className='text-center py-2 text-sm text-neutral-200 font-bold'>
							Made with 💖 by{" "}
							<a
								href='https://github.com/tejas-git64'
								alt='github'
								className='text-teal-500 font-bold'
							>
								Tej
							</a>
						</p>
					</footer>
				</div>
			</div>
		</>
	);
}
