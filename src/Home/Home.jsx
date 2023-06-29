import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AppContext } from "../App";

const item = {
	hidden: {
		opacity: 0,
		x: -15,
		transition: {
			x: { stiffness: 1000, velocity: -100 },
		},
	},
	show: {
		opacity: 1,
		x: 0,
		transition: {
			x: { stiffness: 1000 },
			duration: 0.5,
		},
	},
};

const container = {
	hidden: {
		transition: {
			type: "spring",
			staggerChildren: 0.05,
			stiffness: 200,
			damping: 30,
		},
	},
	show: {
		transition: {
			type: "spring",
			staggerChildren: 0.1,
			delayChildren: 0.3,
			stiffness: 10,
			damping: 10,
		},
	},
};

export default function Home() {
	const hour = new Date().getHours();
	const homeContext = useContext(AppContext);
	let [greeting, setGreeting] = useState("");
	let musicData;
	let [home, setHome] = useState({
		albums: [],
		charts: [],
		playlists: [],
		trending: {
			albums: [],
		},
	});
	let homeRef = useRef();

	async function getMusic() {
		const music = await fetch(
			"https://saavn.me/modules?language=english,hindi"
		);
		musicData = await music.json();
		setHome(musicData.data);
	}

	function setPage() {
		switch (true) {
			default:
				setGreeting("Jump back in 🎶");
				break;
			case hour > 6 && hour < 12:
				setGreeting("Rise and Shine 🌅");
				break;
			case hour > 12 && hour < 15:
				setGreeting("Good Afternoon ☀️");
				break;
			case hour > 15 && hour < 18:
				setGreeting("Good Evening 🌇");
				break;
			case hour > 18 && hour < 6:
				setGreeting("Calm nights 🌜");
				break;
		}
	}

	useEffect(() => {
		getMusic();
	}, []);

	useEffect(() => {
		setPage();
	}, [window.location.pathname]);

	function userShow() {
		const userMenu = document.getElementById("userMenu");
		userMenu.classList.toggle("hidden");
		userMenu.classList.toggle("backdrop:blur-md");
	}

	function signOut() {
		localStorage.removeItem("user");
	}

	return (
		<>
			<div
				ref={homeRef}
				className='w-full lg:w-[calc(100%-45%)] 2xl:w-[calc(100%-30%)] z-0 h-screen bg-black'
			>
				<div
					id='main'
					className='w-full mx-auto h-full relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-900 to-neutral-600 shadow-2xl shadow-black'
				>
					{/* Top Nav */}
					<nav className='w-full mb-2 h-16 bg-transparent'>
						<ul className='w-full h-full flex items-center justify-between p-6'>
							<li>
								<p className='text-white text-xl px-2 pl-0 font-bold'>
									{greeting}
								</p>
							</li>
							<li>
								<button onClick={userShow} className='bg-transparent'>
									<img
										src={homeContext.avatar}
										alt='user'
										className={`w-10 h-10 mt-3 border-[1px] border-purple-600 rounded-full`}
									/>
								</button>
								<div
									id='userMenu'
									className='w-full bg-transparent h-full hidden transition-all ease-in-out delay-35 z-10 items-center justify-center absolute left-0 top-[70px]'
								>
									<ul
										className='w-64 h-auto mt-12 mx-auto p-4 pt-2 bg-black flex flex-col justify-center rounded-lg
              '
									>
										<button
											onClick={userShow}
											className='w-6 h-6 p-2 ml-48 border-none outline-none bg-transparent'
										>
											❌
										</button>
										<li className='w-full h-14 mt-4 mb-1 hover:bg-slate-900 rounded-md'>
											<Link
												to='/home/profile'
												className='w-full h-full font-bold text-white flex items-center p-4 px-6'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 448 512'
													className='w-5 h-5 mr-6 invert'
												>
													<path d='M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z' />
												</svg>
												View Profile
											</Link>
										</li>
										<li className='w-full h-14 hover:bg-red-700 rounded-md'>
											<Link
												to='/login'
												onClick={signOut}
												className='w-full h-full font-bold text-white flex items-center p-6'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 512 512'
													className='w-5 h-5 mr-6 invert'
												>
													<path d='M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z' />
												</svg>
												Sign out
											</Link>
										</li>
									</ul>
								</div>
							</li>
						</ul>
					</nav>
					<div className='w-full h-[calc(100%-13%)] bg-transparent overflow-y-scroll'>
						{/* Songs */}
						{/* Charts */}
						<div className='w-full h-[260px] lg:h-72 my-2 mb-4 bg-transparent overflow-x-hidden flex flex-col'>
							<h1 className='text-2xl xl:text-3xl text-left font-bold text-white px-6 pt-2 pb-1 xl:pb-2'>
								Charts
							</h1>
							<motion.ul
								variants={container}
								initial='hidden'
								animate='show'
								exit='hidden'
								className='w-full 2xl:w-[1225px] h-[250px] whitespace-nowrap p-6 flex overflow-x-scroll overflow-y-hidden'
							>
								{home.charts.map((chart) => (
									<motion.li key={chart.id} variants={item}>
										<Link
											to={`/home/playlist/${chart.id}`}
											className='w-[130px] h-40 mr-[25px] lg:h-52 lg:mr-[45px] list-none flex flex-col items-center flex-shrink-0'
										>
											<img
												src={chart.image[2].link}
												alt='user-profile'
												className='w-32 h-32 lg:w-40 lg:h-36 rounded-md'
											/>
											<p className='text-white text-sm font-bold mt-1 whitespace-pre-line'>
												{chart.title}
											</p>
										</Link>
									</motion.li>
								))}
							</motion.ul>
						</div>
						{/* Trending */}
						<div className='w-full h-[260px] lg:h-80 my-2 mb-10 bg-transparent overflow-x-hidden flex flex-col'>
							<h1 className='text-2xl xl:text-3xl text-left font-bold text-white px-6 pt-2 pb-1 xl:pb-2'>
								Trending
							</h1>
							<motion.ul
								variants={container}
								initial='hidden'
								animate='show'
								className='w-full 2xl:w-[1225px] h-auto xl:mx-0 whitespace-nowrap p-6 lg:px-2.5 flex overflow-x-scroll overflow-y-hidden'
							>
								{home.trending.albums.map((album) => (
									<motion.li variants={item}>
										<Link
											to={`/home/album/${album.id}`}
											key={album.id}
											className='w-[150px] h-auto mr-[30px] lg:mr-[20px] lg:w-[170px] list-none flex flex-col items-center flex-shrink-0 whitespace-normal'
										>
											<img
												src={album.image[2].link}
												alt='user-profile'
												className='w-32 h-32 lg:w-34 lg:h-34 mb-4 rounded-full'
											/>
											<p className='h-24 text-white text-sm font-bold mt-1 whitespace-pre-line overflow-y-hidden'>
												{album.name}
											</p>
										</Link>
									</motion.li>
								))}
							</motion.ul>
						</div>
						{/* Albums */}
						<div className='w-full h-[260px] lg:h-[330px] my-2 mb-10 bg-transparent overflow-x-hidden flex flex-col'>
							<h1 className='text-2xl xl:text-3xl text-left font-bold text-white px-6 pt-2 mt-2 pb-1 xl:pb-2'>
								Latest Albums
							</h1>
							<motion.ul
								variants={container}
								initial='hidden'
								animate='show'
								className='w-full 2xl:w-[1225px] h-auto mx-1 xl:mx-0 whitespace-nowrap p-6 xl:px-5 flex overflow-x-scroll overflow-y-hidden'
							>
								{home.albums.map((album) => (
									<motion.li variants={item}>
										<Link
											to={`/home/album/${album.id}`}
											key={album.id}
											className='w-[130px] h-auto mr-[25px] lg:mr-[35px] lg:w-[150px] list-none flex flex-col items-center flex-shrink-0 whitespace-normal'
										>
											<img
												src={album.image[2].link}
												alt='user-profile'
												className='w-auto h-32 xl:w-[140px] xl:h-36'
											/>
											<p className='text-white text-sm font-bold mt-1 whitespace-pre-line'>
												{album.name}
											</p>
										</Link>
									</motion.li>
								))}
							</motion.ul>
						</div>
						{/* Playlists */}
						<div className='w-full h-[330px] lg:h-[370px] bg-transparent mt-10 mb-24 overflow-x-hidden flex flex-col justify-center'>
							<h1 className='text-2xl xl:text-3xl text-left font-bold text-white px-6 pb-1 lg:pb-2'>
								Popular Playlists
							</h1>
							<motion.ul
								variants={container}
								initial='hidden'
								animate='show'
								className='w-full h-auto 2xl:w-[1225px] whitespace-nowrap p-6 flex overflow-x-scroll overflow-y-hidden'
							>
								{home.playlists.map((playlist) => (
									<motion.li variants={item}>
										<Link
											to={`/home/playlist/${playlist.id}`}
											key={playlist.id}
											className='w-48 h-auto lg:w-52 lg:h-72 mr-[30px] list-none flex flex-col items-center flex-shrink-0'
										>
											<img
												src={playlist.image[2].link}
												alt='user-profile'
												className='w-48 h-48 xl:w-52 xl:h-52'
											/>
											<p className='text-white text-sm xl:text-base font-bold mt-1 whitespace-pre-line'>
												{playlist.title}
											</p>
										</Link>
									</motion.li>
								))}
							</motion.ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
