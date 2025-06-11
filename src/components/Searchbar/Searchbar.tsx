import { useDeferredValue, useEffect, useState } from "react";
import { getSearchResults } from "../../api/requests";
import searchIcon from "../../assets/svgs/icons8-search.svg";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const trimmed = deferredQuery.trim();
    if (trimmed !== "") {
      const handler = setTimeout(() => {
        getSearchResults(trimmed.replace(/ +/g, "+"));
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [deferredQuery]);

  return (
    <>
      <div className="mr-3 flex h-10 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-900 2xl:ml-0">
        <img
          src={searchIcon}
          alt="search-icon"
          className="w-[35px] bg-neutral-900 py-3 pl-2 pr-1 invert-[0.2] sm:w-auto sm:p-2 sm:pr-1"
        />
        <input
          type="search"
          name="searchbar"
          style={{
            wordSpacing: "3px",
          }}
          value={query}
          aria-label="searchbar"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, albums, playlists or artists"
          className="placeholder: h-full w-full border-none bg-neutral-700 px-2 font-medium text-neutral-300 outline-none placeholder:font-medium placeholder:text-neutral-400"
        />
      </div>
    </>
  );
}
