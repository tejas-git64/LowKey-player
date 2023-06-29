import React from "react";

export default function Activity(props) {

    return (
      <>
        <li className="w-full h-auto border-b-[1px] border-gray-800 py-2">
          <p className="w-full h-auto font-semibold px-4 mb-1 text-left text-white">
            {props.latest.message}
          </p>
          <p className="w-full text-sm px-4 text-right text-white">
            {props.latest.date}
          </p>
        </li>
      </>
    );
}