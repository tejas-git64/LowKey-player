import React, { useEffect, useRef, useState } from "react";
import like from "../assets/like.png";
import liked from "../assets/liked.png";
import shuffle from "../assets/icons8-shuffle-64.png";
import follow from "../assets/icons8-add-user-male-64.png";
import lowVol from "../assets/icons8-low-volume-90.png";
import MobileMenu from "./Mobilemenu";

export default function NowPlaying(props) {
	const pathname = window.location.pathname;
	let [expanded, setExpanded] = useState(false);
	let [isFavorite, setIsFavorite] = useState(false);
	const intervalRef = useRef();
	let [play, setPlay] = useState(false);
	const [song, setSong] = useState({});

	useEffect(() => {
		setSong(props.track ? props.track.downloadUrl : null);
	}, [props.track]);

	//Track index  - only needed when switching tracks
	const [trackIndex, setTrackIndex] = useState(0);
	const [trackProgress, setTrackProgress] = useState("0:00"); //Track Progress
	const [volume, setVolume] = useState(0);

	function getDuration(secs) {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return minutes + ":" + returnedSeconds;
	}

	//Interval Clear
	intervalRef.current = setInterval(() => {
		if (song.ended) {
			setPlay((prev) => !prev);
			toNextTrack();
		} else {
			setTrackProgress(song.currentTime);
		}
	}, [1000]);

	function onScrub(value) {
		clearInterval(intervalRef.current);
		song.currentTime = value;
		setTrackProgress(song.currentTime);
	}

	function onScrubEnd() {
		if (!isPlaying) {
			props.setIsPlaying((prev) => !prev);
		}
		startTimer();
	}

	//PrevTrack
	const toPrevTrack = () => {
		if (trackIndex - 1 < 0) {
			setTrackIndex(0);
			props.setNowPlaying(props.groupList[trackIndex]);
			song.currentTime = 0;
			clearInterval(intervalRef.current);
		} else {
			setTrackIndex(trackIndex - 1);
			props.setNowPlaying(props.groupList[trackIndex]);
			song.currentTime = 0;
		}
	};

	//NextTrack
	const toNextTrack = () => {
		if (trackIndex < props.groupList.length - 1) {
			setTrackIndex(trackIndex + 1);
			props.setNowPlaying(props.groupList[trackIndex]);
			clearInterval(intervalRef.current);
			song.currentTime = 0;
		} else {
			setTrackIndex(0);
			props.setNowPlaying(props.groupList[trackIndex]);
			song.currentTime = 0;
			song.pause();
		}
	};

	//Toggling track play
	function togglePlay() {
		if (song.paused) {
			song.play();
			setPlay((prev) => !prev);
			props.setIsPlaying((prev) => !prev);
		} else {
			song.pause();
			setPlay((prev) => !prev);
			props.setIsPlaying((prev) => !prev);
		}
	}

	//Changing volume
	function changeVolume(e) {
		song.volume = e.currentTarget.value / 100;
		setVolume((song.volume * 100).toFixed(0));
	}

	useEffect(() => {
		if (song.isPlaying === false) {
			song.currentTime = 0;
			props.setNowPlaying(props.track);
			togglePlay();
		}
	}, [play]);

	function expand() {
		setExpanded(!expanded);
	}

	function addFavorite() {
		if (props.favorites.some((song) => song.id === props.track.id)) {
			setIsFavorite(false);
			props.setFavorites(
				props.favorites.filter((song) => song.id !== props.track.id)
			);
		} else {
			props.setFavorites([props.track, ...props.favorites]);
			setIsFavorite(true);
			if (props.favorites.includes(props.track)) {
				props.addLikedActivity();
			}
		}
	}

	function toggleFollow() {
		if (props.followings.some((maker) => maker.name === props.track.name)) {
			props.setFollowings(
				props.followings.filter((a) => a.id !== props.track.id)
			);
		} else {
			props.setFollowings((prev) => [props.track.primaryArtists, ...prev]);
		}
	}

	function showVol() {
		document.getElementById("volume").classList.toggle("hidden");
	}

	return (
		<>
			<div
				onDoubleClick={expand}
				className={`w-full px-4 fixed bottom-16 lg:bottom-0 z-30 transition-all ease-in-out delay-45 flex items-center ${
					props.isLogin || window.location.pathname === "/" ? "hidden" : "block"
				} ${
					expanded
						? "h-full flex-col pt-16 justify-center sm:justify-evenly bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-800 to-black"
						: "h-[60px] bg-neutral-900"
				}`}
			>
				<img
					src={props.track.image}
					alt='cover'
					className={`${
						expanded
							? "w-72 h-auto sm:w-auto sm:h-[calc(100%-50%)] md:w-auto md:h-[calc(100%-40%)] md:mt-14 xl:mt-0 xl:w-auto xl:h-[calc(100%-15%)] mx-auto mb-10"
							: "w-auto h-10 text-sm whitespace-nowrap"
					}`}
				/>
				<div className={`w-full flex flex-col ${expanded ? "ml-0" : "ml-2"}`}>
					<div
						className={`w-full h-auto flex justify-between ${
							expanded ? "flex-col px-4" : ""
						}`}
					>
						<div
							className={`flex flex-col justify-center overflow-x-clip whitespace-nowrap ${
								expanded
									? "w-72 md:w-auto text-center mx-auto items-center pl-4 whitespace-pre-line"
									: "w-48 -mr-96 md:w-[500px] md:-mr-96 lg:w-[350px] lg:-mr-0 xl:w-[400px] xl:-mr-0 2xl:w-[450px] 2xl:-mr-28"
							}`}
						>
							<h2
								className={`text-white px-2 text-left font-bold whitespace-nowrap ${
									expanded
										? "whitespace-pre-line text-center text-xl mb-2 md:whitespace-nowrap"
										: "text-sm"
								}`}
							>
								{props.track.name ? props.track.name : props.track.title}
							</h2>
							<p
								name='artist'
								className={`px-2 text-left font-medium text-gray-500 ${
									expanded ? "text-xl text-center" : "text-sm"
								}`}
							>
								{props.track.primaryArtists}
							</p>
						</div>
						<div
							className={`w-full flex items-center justify-center ${
								expanded ? "my-12" : "m-0"
							}`}
						>
							<p
								className={`text-gray-200 ${
									expanded ? "block" : "hidden lg:block"
								}`}
							>
								{getDuration(trackProgress)}
							</p>
							<input
								id='seek-slider'
								type='range'
								min='0'
								max={song.duration}
								step='1'
								value={trackProgress}
								onChange={(e) => onScrub(e.target.value)}
								onMouseUp={onScrubEnd}
								onKeyUp={onScrubEnd}
								className={`w-[calc(100&-10%)] md:w-[calc(100%-35%)] appearance-none h-[2px] mx-4 ${
									expanded ? "block w-[calc(100%-20%)]" : "hidden lg:block"
								}`}
							/>
							<p
								className={`text-gray-200 ${
									expanded ? "block" : "hidden lg:block"
								}`}
							>
								{getDuration(props.track.duration) ||
									getDuration(song.duration)}
							</p>
						</div>
						<div
							className={`whitespace-nowrap flex ${
								expanded ? "lg:mb-10" : "mx-2"
							} justify-between items-center`}
						>
							<button
								onClick={addFavorite}
								className={`cursor-pointer bg-transparent outline-none md:block ${
									expanded
										? "w-12 h-16 xl:-mr-4 xl:ml-4"
										: "w-auto mr-2 lg:mx-0 md:w-12 md:h-8"
								}`}
							>
								<img
									src={isFavorite ? liked : like}
									alt='like'
									className={`${
										expanded ? "w-8 h-8 xl:w-10 xl:h-10" : "w-6 h-6"
									}`}
								/>
							</button>
							<button
								onClick={toggleFollow}
								className={`mb-1 cursor-pointer bg-transparent outline-none border-none hidden ${
									expanded ? "w-10 h-10 xl:block" : "w-7 lg:w-16 h-7"
								}`}
							>
								<img
									src={follow}
									alt='follow'
									className={`${expanded ? "xl:w-8 xl:h-8" : "w-7 h-7"}`}
								/>
							</button>
							<div className='m-4 xl:mx-4 whitespace-nowrap flex justify-center items-center'>
								<button
									onClick={toPrevTrack}
									className={`p-1 m-1 ml-0 bg-transparent outline-none border-none md:block ${
										expanded ? "block" : "hidden"
									}`}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 320 512'
										className={`invert rounded-full hover:fill-lime-500 ${
											expanded ? "w-8 h-8" : "w-6 h-6"
										}`}
									>
										<path d='M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z' />
									</svg>
								</button>
								<button
									id='play'
									onClick={togglePlay}
									className={`${
										expanded ? "mx-8 xl:mx-16" : "-mr-4 md:mx-4"
									} bg-transparent outline-none border-none rounded-full shadow-emerald-500 hover:shadow-2xl`}
								>
									{play ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 512 512'
											className={`invert rounded-full fill-pink-700 ${
												expanded ? "w-12 h-12" : "w-8 h-8"
											}`}
										>
											<path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM224 192V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32z' />
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 512 512'
											className={`invert rounded-full fill-pink-700 ${
												expanded ? "w-12 h-12" : "w-8 h-8"
											}`}
										>
											<path d='M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z' />
										</svg>
									)}
								</button>
								<button
									onClick={toNextTrack}
									className={`p-1 m-1 bg-transparent outline-none border-none md:block ${
										expanded ? "block" : "hidden"
									}`}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 320 512'
										className={`invert rounded-full hover:fill-lime-500 ${
											expanded ? "w-8 h-8" : "w-6 h-6"
										}`}
									>
										<path d='M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z' />
									</svg>
								</button>
							</div>
							<button
								className={`w-auto h-auto bg-transparent rounded-full outline-none border-none md:block ${
									expanded ? "block" : "hidden"
								}`}
							>
								<img
									src={shuffle}
									alt='share'
									className={` ${
										expanded ? "w-8 h-8 xl:w-9 xl:h-10" : "w-10 h-7"
									}`}
								/>
							</button>
							<div
								className={`w-auto h-auto bg-transparent rounded-full flex flex-col outline-none ${
									expanded
										? "hidden xl:block xl:-ml-[calc(100%-80%)]"
										: "hidden"
								}`}
							>
								<div
									id='volume'
									className='fixed transform -rotate-90 transition-all ease-out delay-25 justify-between hidden items-center bottom-60 -right-12 px-10'
								>
									<p className='transform rotate-90 absolute right-0 font-bold text-white'>
										100
									</p>
									<input
										id='nowvol'
										onInput={changeVolume}
										value={volume}
										type='range'
										min='0'
										max='100'
										className='bg-transparent -mb-1'
									/>
									<p className='transform rotate-90 absolute top-0 left-2 font-bold text-white'>
										{volume}
									</p>
								</div>
							</div>
							<button
								onClick={showVol}
								className={`w-auto h-auto bg-transparent rounded-full outline-none border-none ${
									expanded ? "hidden xl:block xl:mr-5" : "hidden"
								}`}
							>
								<img
									src={lowVol}
									alt='share'
									className={` ${
										expanded ? "w-10 h-10 xl:w-12 xl:h-12" : "hidden"
									}`}
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
			{pathname === "/login" || pathname === "/" ? "" : <MobileMenu />}
		</>
	);
}
