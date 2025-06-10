import { Link } from "react-router-dom";
import home from "../../assets/svgs/icons8-home.svg";
import search from "../../assets/svgs/icons8-search.svg";
import fav from "../../assets/svgs/icons8-heart.svg";
import library from "../../assets/svgs/icons8-library.svg";

export default function MobileNav() {
  return (
    <nav className="mt-1 flex h-16 w-full items-center justify-around rounded-t-2xl bg-neutral-950 py-2">
      <Link
        to={"/home"}
        className="flex flex-col items-center invert-[0.3] hover:invert-0"
      >
        <img src={home} alt="home" className="h-[26px] w-[26px]" />
        <p className="text-xs text-neutral-200">Home</p>
      </Link>
      <Link
        to={"/search"}
        className="flex flex-col items-center invert-[0.3] hover:invert-0"
      >
        <img src={search} alt="search" className="h-[25px] w-[25px]" />
        <p className="text-xs text-neutral-200">Search</p>
      </Link>
      <Link
        to={"/favorites"}
        className="flex flex-col items-center invert-[0.3] hover:invert-0"
      >
        <img src={fav} alt="favorites" className="h-[25.5px] w-[25.5px]" />
        <p className="text-xs text-neutral-200">Favorites</p>
      </Link>
      <Link
        to={"/library"}
        className="flex flex-col items-center invert-[0.3] hover:invert-0"
      >
        <img src={library} alt="library" className="h-[23px] w-[23px]" />
        <p className="text-xs text-neutral-200">Library</p>
      </Link>
    </nav>
  );
}
