import React, { useState } from "react";

export default function Create(props) {
	const playlist = document.getElementById("name");
	const [input, setInput] = useState("");
	function toggleCreate() {
		props.setIsCreating((prev) => !prev);
	}

	//Playlist Creation
	function createPlaylist() {
		props.setYourPlaylists((prev) => {
			return [
				{
					playlistName: playlist.value,
					songs: [
						{
							name: "Unknown song",
							primaryArtists: "Unknown",
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
							isPlaying: false,
							image: [
								{
									link: "",
								},
								{},
								{},
							],
						},
					],
				},
				...prev,
			];
		});
		toggleCreate();
		props.addPlaylistActivity();
	}

	return (
		<>
			<div
				className={`w-full h-full fixed flex flex-col items-center z-20 bg-gradient-to-t from-black to-transparent ${
					props.isCreating ? "block" : "hidden"
				}`}
			>
				<div className='w-full md:w-[calc(100%-40%)] lg:w-[calc(100%-60%)] h-[300px] absolute top-60 bg-black rounded-lg'>
					<div className='w-full flex border-b-[1px] border-neutral-900 justify-between px-10'>
						<h2 className='text-2xl text-white font-bold py-6'>
							Create New Playlist
						</h2>
						<button onClick={toggleCreate} className='bg-transparent'>
							✖️
						</button>
					</div>
					<ul className='w-full h-32'>
						<li className='w-full h-full mt-0 flex flex-col justify-center px-10'>
							<label
								htmlFor='name'
								className='text-lg mb-3 -mt-2 font-bold text-left text-green-600'
							>
								Enter Playlist name
							</label>
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								type='text'
								id='name'
								className='h-14 bg-transparent border-2 border-dashed border-neutral-700 rounded-md px-3 text-xl font-semibold outline-none placeholder:text-neutral-700 placeholder:text-base text-white'
								placeholder='Something tacky'
								required
							/>
						</li>
						<li>
							<button
								onClick={createPlaylist}
								className='w-32 h-12 bg-purple-600 shadow-lg transform transition-all delay-35 mt-2 translate-y-3 hover:-translate-y-0 border-none outline-none font-bold text-lg text-white rounded-full'
							>
								Create
							</button>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
