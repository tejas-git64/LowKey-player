import { useDeferredValue, useEffect, useState } from "react";
import { getSearchResults } from "../../api/requests";
import searchIcon from "../../assets/icons8-search.svg";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (query !== "") {
      getSearchResults(deferredQuery.replace(" ", "+"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQuery]);

  return (
    <>
      <div className="mx-auto mr-3 flex h-10 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-200 sm:ml-4 sm:h-12 lg:ml-3 xl:ml-2 2xl:ml-0">
        <img
          src={searchIcon}
          alt="search-icon"
          className="w-[35px] pl-3 invert-[0.5] sm:w-auto sm:p-2 sm:pr-1"
        />
        <input
          type="search"
          name="searchbar"
          style={{
            wordSpacing: "3px",
          }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search for songs, albums, playlists or artists"
          className="placeholder: h-full w-full border-none bg-neutral-200 px-2 font-semibold text-neutral-800 outline-none placeholder:font-medium placeholder:text-neutral-400"
        />
      </div>
    </>
  );
}
