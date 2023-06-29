import React, { createContext, useEffect, useState, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import "./App.css";
import Login from "./components/Login";
import NowPlaying from "./components/NowPlaying";
import UserMenu from "./components/Usermenu";
import Home from "./Home/Home";
import Recents from "./Recents/Recents";
import Favoriteslist from "./Home/Favoritelist";
import Artist from "./Home/Artist";
import Album from "./Home/Album";
import Songslist from "./Home/Songslist";
import Playlist from "./Home/Playlist";
import Library from "./components/Library";
import Profile from "./components/Profile";
import Create from "./Home/Create";
import UserPlaylist from "./components/UserPlaylist";
import { AddToPlaylist } from "./Home/AddToPlaylist";
import Intro from "./components/Intro";

export let AppContext = createContext();
export default function App() {
	//Global States
	let [isLogin, setIsLogin] = useState(true);
	const routeLocation = useLocation();
	let [isPlaying, setIsPlaying] = useState(false);
	let [favorites, setFavorites] = useState([]);
	let [isCreating, setIsCreating] = useState(false); //Toggle Playlist creation form
	let [activity, setActivity] = useState([]); //Create new Activity
	let [followings, setFollowings] = useState([]);
	let [addMenu, setAddMenu] = useState(false);
	let [playlistSong, setPlaylistSong] = useState({});
	let [groupList, setGroupList] = useState([]);
	let [profile, setProfile] = useState({});

	const date = new Date();

	//Users Playlists
	let [yourPlaylists, setYourPlaylists] = useState([]);

	//Now Playing
	//Track info
	let [track, setTrack] = useState({
		name: "",
		title: "",
		primaryArtists: "",
		downloadUrl: [
			{},
			{},
			{},
			{},
			{
				link: "",
			},
		],
		duration: "",
		id: "",
		index: 0,
		url: "",
		isPlaying: false,
		image: [
			{
				link: "",
			},
			{},
			{},
		],
	});

	async function getSongUrl(url) {
		let result = await fetch(`https://saavn.me/songs?link=${url}`);
		let json = await result.json();
		return json.data[0].downloadUrl[4].link;
	}

	//Recent History
	let [recents, setRecents] = useState([]);

	//sample song url for testing
	// "https://ia801007.us.archive.org/14/items/thechainsmokerscoldplaysomethingjustlikethis/The%20Chainsmokers%20%26%20Coldplay%20-%20Something%20Just%20Like%20This.mp3"
	function setNowPlaying(song) {
		setTrack({
			name: song.name ? song.name : "",
			title: song.title ? song.title : "",
			primaryArtists: song.primaryArtists,
			downloadUrl: song.downloadUrl
				? new Audio(song.downloadUrl[3].link)
				: new Audio(getSongUrl(song.url)),
			duration: Number(song.duration) || undefined,
			id: song.id,
			index: song.index,
			isPlaying: false,
			image: song.image[2].link,
		});
		setRecents((prev) => [
			{
				...song,
			},
			...prev,
		]);
	}

	//Recent Activity
	function addPlaylistActivity() {
		if (yourPlaylists.length > 0) {
			setActivity((prev) => {
				return [
					{
						message: `New playlist "${yourPlaylists[0].playlistName}" created`,
						date: `on ${date.getDate()}.${
							date.getMonth() + 1
						}.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}${
							date.getHours() < 12 ? "am" : "pm"
						}`,
					},
					...prev,
				];
			});
		}
	}

	function addLikedActivity() {
		if (favorites.length > 0) {
			setActivity((prev) => {
				return [
					{
						message: `Liked ❤️ "${
							favorites ? favorites[0].name : favorites[0].title || ""
						}"`,
						date: `on ${date.getDate()}.${
							date.getMonth() + 1
						}.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}${
							date.getHours() < 12 ? "am" : "pm"
						}`,
					},
					...prev,
				];
			});
		}
	}

	function setPlayQue(list) {
		setGroupList(list);
	}

	useEffect(() => {
		switch (true) {
			case routeLocation.pathname !== "/login":
				setIsLogin(false);
				break;
			case routeLocation.pathname === "/login":
				setIsLogin(true);
				break;
			case "default":
				setIsLogin(false);
				break;
		}
		setProfile(JSON.parse(localStorage.getItem("user")));
	}, [routeLocation.pathname]);

	const avatar = createAvatar(openPeeps, {
		size: 128,
		seed: profile ? profile.name : undefined,
		// ... other options
	}).toDataUriSync();

	return (
		<div className='App w-full h-full flex flex-col overflow-hidden transition-all ease-linear delay-75'>
			<div className='w-full h-full flex items-center bg-black'>
				<UserMenu
					isLogin={isLogin}
					setIsLogin={setIsLogin}
					yourPlaylists={yourPlaylists}
					setYourPlaylists={setYourPlaylists}
					isCreating={isCreating}
					setIsCreating={setIsCreating}
					followings={followings}
					setFollowings={setFollowings}
				/>
				<AppContext.Provider
					value={{
						setNowPlaying,
						addLikedActivity,
						setPlayQue,
						profile,
						avatar,
						followings: [followings, setFollowings],
						favorites: [favorites, setFavorites],
						yourPlaylists: [yourPlaylists, setYourPlaylists],
						track: [track, setTrack],
						groupList: [groupList, setGroupList],
						recents: [recents, setRecents],
						isPlaying: [isPlaying, setIsPlaying],
						addMenu: [addMenu, setAddMenu],
						playlistSong: [playlistSong, setPlaylistSong],
					}}
				>
					<Routes>
						<Route path='/' element={<Intro replace />} />
						<Route path='/login' element={<Login replace />} />
						<Route path='home' element={<Home replace />} />
						<Route path='home/favorites' element={<Favoriteslist replace />} />
						<Route path='home/library' element={<Library replace />} />
						<Route path='home/profile' element={<Profile />} />
						<Route
							path='home/userplaylist/:playlistName'
							element={<UserPlaylist />}
						/>
						<Route path='home/artist/:artistId' element={<Artist replace />} />
						<Route path='home/album/:albumid' element={<Album replace />} />
						<Route path='home/songslist' element={<Songslist replace />} />
						<Route
							path='home/playlist/:playlistid'
							element={<Playlist replace />}
						/>
					</Routes>
				</AppContext.Provider>
				<Recents
					isLogin={isLogin}
					setIsLogin={setIsLogin}
					activity={activity}
					recents={recents}
					setNowPlaying={setNowPlaying}
					setRecents={setRecents}
				/>
			</div>
			<AddToPlaylist
				addMenu={addMenu}
				setAddMenu={setAddMenu}
				yourPlaylists={yourPlaylists}
				setYourPlaylists={setYourPlaylists}
				playlistSong={playlistSong}
				setPlaylistSong={setPlaylistSong}
			/>
			<Create
				yourPlaylists={yourPlaylists}
				setYourPlaylists={setYourPlaylists}
				isCreating={isCreating}
				setIsCreating={setIsCreating}
				addPlaylistActivity={addPlaylistActivity}
			/>
			<NowPlaying
				isLogin={isLogin}
				setIsLogin={setIsLogin}
				addLikedActivity={addLikedActivity}
				favorites={favorites}
				followings={followings}
				setFollowings={setFollowings}
				setFavorites={setFavorites}
				track={track}
				setTrack={setTrack}
				setNowPlaying={setNowPlaying}
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
				groupList={groupList}
				setGroupList={setGroupList}
			/>
		</div>
	);
}
