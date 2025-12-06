import { Link } from "react-router-dom";
import home from "/svgs/icons8-home.svg";
import search from "/svgs/icons8-search.svg";
import fav from "/svgs/icons8-heart.svg";
import library from "/svgs/icons8-library.svg";

export default function MobileNav() {
  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      className="mt-1 flex h-16 w-full items-center justify-around rounded-t-2xl bg-gradient-to-t from-black to-transparent py-2"
    >
      <Link
        to={"/home"}
        tabIndex={0}
        aria-label="Go to Home"
        className="flex flex-col items-center outline-none invert-[0.3] hover:invert-0 focus:invert-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          src={home}
          alt="Home icon"
          className="h-[26px] w-[26px]"
          aria-hidden="true"
        />
        <p className="text-xs text-neutral-200">Home</p>
      </Link>
      <Link
        to={"/search"}
        tabIndex={0}
        aria-label="Go to Search"
        className="flex flex-col items-center outline-none invert-[0.3] hover:invert-0 focus:invert-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          src={search}
          alt="Search icon"
          className="h-[25px] w-[25px]"
          aria-hidden="true"
        />
        <p className="text-xs text-neutral-200">Search</p>
      </Link>
      <Link
        to={"/favorites"}
        tabIndex={0}
        aria-label="Go to Favorites"
        className="flex flex-col items-center outline-none invert-[0.3] hover:invert-0 focus:invert-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          src={fav}
          alt="Favorites icon"
          className="h-[25.5px] w-[25.5px]"
          aria-hidden="true"
        />
        <p className="text-xs text-neutral-200">Favorites</p>
      </Link>
      <Link
        to={"/library"}
        tabIndex={0}
        aria-label="Go to Library"
        className="flex flex-col items-center outline-none invert-[0.3] hover:invert-0 focus:invert-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          src={library}
          alt="Library icon"
          className="h-[23px] w-[23px]"
          aria-hidden="true"
        />
        <p className="text-xs text-neutral-200">Library</p>
      </Link>
    </nav>
  );
}
