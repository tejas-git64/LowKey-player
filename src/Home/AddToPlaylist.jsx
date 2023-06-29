import React, {useEffect, useState} from "react";

export function AddToPlaylist(props) {

    let [checkedPlaylists, setCheckedPlaylists] = useState([])

    function toggleMenu() {
        props.setAddMenu(prev => !prev)
    }
    
    function handleCheckBox(e, playlist) {
        if(e.target.checked) {
            setCheckedPlaylists(prev => [prev, playlist])
        } else {
            if(checkedPlaylists.includes(playlist)) {{
                setCheckedPlaylists(checkedPlaylists.filter(p => p.playlistName !== playlist.playlistName))
            }}
        }
    }

    function addSongToPlaylist() {
        setCheckedPlaylists(checkedPlaylists.forEach(playlist => ({
            ...playlist,
            songs: [...playlist.songs,props.playlistSong]
        })))
        toggleMenu()
    }

    // useEffect(()=>{
    //     console.log(checkedPlaylists);
    //     console.log(...checkedPlaylists);
    // },[checkedPlaylists])
    
    return (
        <>
            <div className={`w-full h-full fixed ${props.addMenu ? "flex" : "hidden"} flex-col items-center z-20 bg-gradient-to-t from-black to-transparent`}>
                <div className="w-full h-[calc(100%-30%)] md:w-[calc(100%-50%)] p-3 lg:w-[calc(100%-60%)] xl:w-[calc(100%-70%)] 2xl:w-[calc(100%-75%)] absolute top-24 bg-black rounded-lg">
                    <h2 className="pl-2 py-4 pb-6 border-neutral-800 border-b-[1px] text-2xl text-white font-bold text-left">Add to Playlist</h2>
                    <ul className="w-full h-[calc(100%-25%)] mt-4 overflow-y-scroll">
                        {
                        props.yourPlaylists.map((playlist)=>
                            <li className="h-16 border-neutral-700 pr-2 flex items-center justify-start">
                                <input 
                                onChange={event => handleCheckBox(event, playlist)}
                                type="checkbox" className="mx-8 mb-0.5" />
                                <p className="w-96 h-12 pt-2 text-lg text-left text-white font-semibold">{playlist.playlistName}</p>
                            </li>
                        )}
                    </ul>
                    <ul className="mt-4 flex items-center justify-evenly">
                        <li><button 
                        onClick={addSongToPlaylist}
                        className="w-36 h-12 transition-all ease-out delay-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold whitespace-nowrap">Add Song</button></li>
                        <li><button 
                        onClick={toggleMenu}
                        className="w-32 h-12 border-purple-500 border-[1px] bg-transparent text-purple-500 rounded-full font-bold whitespace-nowrap">Cancel</button></li>
                    </ul>
                </div>
            </div>
        </>
    )
}