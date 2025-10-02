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
        getSearchResults(trimmed.replace(/\s+/g, "+"));
      }, 800);
      return () => clearTimeout(handler);
    }
  }, [deferredQuery]);

  return (
    <div
      data-testid="searchbar"
      className="mr-3 flex h-10 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-900 2xl:ml-0"
    >
      <img
        src={searchIcon}
        alt="search-icon"
        width={35}
        height={35}
        fetchPriority="high"
        loading="eager"
        className="w-[35px] bg-neutral-900 py-3 pl-2 pr-1 invert-[0.2] sm:w-auto sm:p-2 sm:pr-1"
      />
      <input
        type="search"
        name="searchbar"
        value={query}
        data-testid="searchinput"
        aria-label="searchbar"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for songs, albums, playlists or artists"
        className="h-full w-full border-none bg-neutral-700 px-2 font-medium tracking-wide text-neutral-300 outline-none placeholder:text-sm placeholder:font-medium placeholder:text-neutral-400 focus-within:bg-neutral-700"
      />
    </div>
  );
}
