import React, { useContext, useEffect, useRef, useState } from "react";
import add from "../assets/icons8-add-to-playlist-50.png";
import { Link } from "react-router-dom";
import { AppContext } from "../App";

export default function Song(props) {
	let [isFavorite, setIsFavorite] = useState(false);
	let songContext = useContext(AppContext);

	//Current Song
	let [track, setTrack] = useState({
		id: "",
		name: "",
		title: "",
		downloadUrl: [{}],
		url: "",
		duration: "",
		image: [
			{
				link: "",
			},
			{},
			{},
		],
		primaryArtists: "",
		primaryArtistsId: "",
	});

	let artists = useRef([""]);
	let artistsIds = useRef([""]);

	function togglePlay() {
		if (songContext.isPlaying[0] === false) {
			songContext.setNowPlaying(track);
			songContext.isPlaying[1]((prev) => !prev);
		} else {
			songContext.isPlaying[1]((prev) => !prev);
		}
	}

	function addSong() {
		songContext.addMenu[1]((prev) => !prev);
		songContext.playlistSong[1](track);
	}

	useEffect(() => {
		setTrack(
			props.favorite ||
				props.asong ||
				props.playsong ||
				props.arsong ||
				props.usong ||
				props.ssong
		);
	}, []);
	artistsIds.current = track.primaryArtistsId
		? track.primaryArtistsId.split(",")
		: null;
	artists.current = track.primaryArtists ? track.primaryArtists.split(",") : [];

	function toggleFavorite() {
		if (songContext.favorites[0].some((song) => song.id === track.id)) {
			setIsFavorite((prev) => !prev);
			songContext.favorites[1](
				songContext.favorites[0].filter((song) => song.id !== track.id)
			);
		} else {
			setIsFavorite((prev) => !prev);
			songContext.favorites[1]([track, ...songContext.favorites[0]]);
		}
		songContext.addLikedActivity();
	}

	return (
		<>
			<li
				onDoubleClick={toggleFavorite}
				onClick={togglePlay}
				className='w-full h-[65px] bg-black border-neutral-900 border-b-[1px] md:my-2 flex items-center justify-between'
			>
				<span className='p-2 pt-1.5 flex items-center'>
					<img
						src={track.image ? track.image[0].link : ""}
						alt='cover'
						className='w-10 h-10 mx-3 mr-4'
					/>
					<div
						id='songinfo'
						className='w-56 md:w-[500px] md:-mr-[100px] lg:w-[350px] lg:-mr-0 xl:w-[400px] xl:-mr-0 2xl:w-[450px] 2xl:-mr-28 text-left overflow-x-clip'
					>
						<h3
							id='title'
							className='w-auto text-left text-white font-semibold whitespace-nowrap overflow-x-hidden'
						>
							{track.name ? track.name : track.title}
						</h3>
						<div className='h-6 w-56 md:w-[500px] md:-mr-[100px] lg:w-[350px] lg:-mr-0 xl:w-[400px] xl:-mr-0 2xl:w-[450px] flex flex-row'>
							{artistsIds.current
								? artistsIds.current.map((artistId, index) => (
										<Link
											key={artistId}
											to={`/home/artist/${artistId.trim()}`}
											id='name'
											className='w-auto text-left text-sm text-neutral-500 mr-2 whitespace-nowrap overflow-x-hidden'
										>
											{artists.current[index].trim()}
										</Link>
								  ))
								: artists.current.map((index) => (
										<p
											key={index}
											id='name'
											className='w-auto text-left text-sm text-neutral-500 mr-2 whitespace-nowrap overflow-x-hidden'
										>
											{index}
										</p>
								  ))}
						</div>
					</div>
				</span>
				<div>
					<ul className='w-auto mr-4 flex items-center justify-end'>
						<li>
							<button
								onClick={toggleFavorite}
								className={`w-6 h-6 bg-black py-1 pl-3 pr-10 ${
									isFavorite ? "block" : "hidden"
								}`}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 512 512'
									className='w-4 h-4 invert'
								>
									<path d='M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z' />
								</svg>
							</button>
						</li>
						<li>
							<button
								onClick={addSong}
								className='w-10 h-10 bg-transparent outline-none py-1 pl-3 pr-2'
							>
								<img
									src={add}
									alt='add-to-playlist'
									className='w-6 h-6 bg-transparent'
								/>
							</button>
						</li>
					</ul>
				</div>
			</li>
		</>
	);
}
