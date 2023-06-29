import React from "react";
import SongsinRecent from "./SonginRecent";
import Activity from "./Activity";

export default function Recents(props) {

  return (
    <>
      <div
        className={`w-full lg:w-[calc(100%-50%)] xl:w-[calc(100%-60%)] h-full mt-4 ${
         props.isLogin || window.location.pathname === "/" ? "hidden" : "hidden lg:block"
        } overflow-x-hidden`}
      >
        <div className="w-full h-auto py-4">
          <h2 className="w-14 h-14 text-xl text-white px-4 font-bold whitespace-nowrap">
            Recent Activity
          </h2>
          <ul className="w-full h-[362px] border-y-[1px] -mt-1 border-gray-700 overflow-y-scroll whitespace-nowrap">  
            {props.activity.map(latest=><Activity latest={latest}/>)}          
          </ul>
        </div>
        <div className="w-full h-auto mt-2 py-4">
          <h2 className="w-14 h-14 text-xl text-white px-4 font-bold whitespace-nowrap">
            Listening History
          </h2>
          <ul className="w-full h-96 border-y-[1px] -mt-1 border-gray-700 overflow-y-scroll">
            {props.recents.map(recent=>
              <SongsinRecent recent={recent} key={recent.id} setNowPlaying={props.setNowPlaying} />
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
