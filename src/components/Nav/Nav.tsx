import { useBoundStore } from "../../store/store";
import logo from "../../assets/logo/sound-waves.png";
import notifimg from "../../assets/svgs/bell-svgrepo-com.svg";
import { ActivityType } from "../../types/GlobalTypes";

export default function Nav() {
  const greeting = useBoundStore((state) => state.greeting);
  return (
    <>
      <nav className="flex h-12 w-full items-center justify-between border-b-2 border-black pl-2.5 pr-[18px]">
        <p className="whitespace-nowrap px-1 text-xl font-semibold text-white sm:text-lg">
          {greeting || "Keep jamming 🎶"}
        </p>
        <NotificationButton />
      </nav>
    </>
  );
}

const Activity = ({ message }: ActivityType) => {
  return (
    <>
      <li className="mb-0.5 line-clamp-1 flex h-[35px] w-full flex-shrink-0 items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-black px-2">
        <p className="mx-1 line-clamp-1 w-auto text-ellipsis text-xs font-semibold text-neutral-300">
          {message}
        </p>
      </li>
    </>
  );
};

const NotificationButton = () => {
  const recents = useBoundStore((state) => state.recents);
  const notifications = useBoundStore((state) => state.notifications);
  const setNotifications = useBoundStore((state) => state.setNotifications);

  function toggleNotifications(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (notifications) {
      setNotifications(false);
    } else {
      setNotifications(true);
    }
  }
  return (
    <div className="flex w-auto items-center justify-between xl:justify-end">
      <div className="flex w-10 items-center">
        <button
          type="button"
          onClick={toggleNotifications}
          className="relative h-6 w-6 bg-transparent p-0 xl:hidden"
        >
          <img
            src={notifimg}
            alt="notification"
            className="h-6 w-6"
            fetchPriority="high"
          />
          {recents.activity.length > 0 && !notifications && (
            <div className="absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-emerald-500"></div>
          )}
        </button>
        <ul
          className={`${
            notifications ? "absolute" : "hidden"
          } right-16 top-11 z-20 flex h-auto min-h-52 w-[300px] flex-col items-start justify-start overflow-y-scroll rounded-b-md rounded-tl-md bg-neutral-900 p-1`}
        >
          {recents.activity.length > 0 ? (
            recents.activity.map((message: string, i: number) => (
              <Activity message={message} key={i} />
            ))
          ) : (
            <p className="w-full pt-20 text-center text-sm">
              No new activity...¯\_(ツ)_/¯
            </p>
          )}
        </ul>
      </div>
      <img
        src={logo}
        alt="menu"
        fetchPriority="high"
        className="h-8 w-8 rounded-full"
      />
    </div>
  );
};
