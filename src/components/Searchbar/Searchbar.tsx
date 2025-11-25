import { useDeferredValue, useEffect, useRef, useState } from "react";
import { getSearchResults } from "../../api/requests";
import searchIcon from "../../assets/svgs/icons8-search.svg";
import { useBoundStore } from "../../store/store";
import { defaultSearchData } from "../../utils/utils";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const setSearch = useBoundStore((state) => state.setSearch);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const trimmed = deferredQuery.trim();
    if (trimmed === "") {
      setSearch(defaultSearchData);
      setQuery("");
    } else {
      timerRef.current = setTimeout(() => {
        getSearchResults(trimmed.replaceAll(/\s+/g, "+"));
      }, 800);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [deferredQuery, setSearch]);

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
