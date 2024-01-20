import { useBoundStore } from "../../store/store";
import logo from "../../assets/sound-waves.png";
import notifsImg from "../../assets/bell-svgrepo-com.svg";
import { ActivityType } from "../../types/GlobalTypes";

export default function Nav() {
  const { greeting, recents, notifications, setNotifications } =
    useBoundStore();

  function toggleNotifs() {
    if (notifications) {
      setNotifications(false);
    } else {
      setNotifications(true);
    }
  }

  const Activity = ({ message }: ActivityType) => {
    return (
      <>
        <li className="mb-0.5 line-clamp-1 flex h-[35px] w-full flex-shrink-0 items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-black px-2">
          <p className=" mx-1 line-clamp-1 w-auto text-ellipsis text-xs font-semibold text-neutral-300">
            {message}
          </p>
        </li>
      </>
    );
  };

  return (
    <>
      <nav className="hidden h-12 w-full items-center justify-between bg-black pl-2.5 pr-[18px] sm:flex">
        <img src={logo} alt="menu" className="h-[38px] w-[38px]" />
        <div className="flex w-auto items-center justify-between xl:justify-end">
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            onClick={() => toggleNotifs()}
            className="relative mr-3 h-[20px] w-[20px] bg-transparent p-0 xl:hidden"
          >
            <img
              src={notifsImg}
              alt="notification"
              className="h-[20px] w-[20px]"
            />
            {recents.activity.length > 0 && !notifications && (
              <p className="absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-emerald-400"></p>
            )}
          </button>
          <ul
            className={`${
              notifications ? "absolute" : "hidden"
            } right-28 top-11 z-20 flex h-40 w-[65%] flex-col items-start justify-start overflow-y-scroll rounded-b-xl rounded-tl-xl bg-neutral-900 p-1`}
          >
            {recents.activity.length > 0 ? (
              recents.activity.map((message: string, i: number) => (
                <Activity message={message} key={i} />
              ))
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <p className="text-xl">¯\_(ツ)_/¯</p>
                <p className="text-sm">Wow, such empty...</p>
              </div>
            )}
          </ul>
          {greeting && (
            <p className="whitespace-nowrap text-sm font-semibold">
              {greeting}
            </p>
          )}
        </div>
      </nav>
    </>
  );
}
