import SongFallback from "../../components/Song/SongFallback";

export default function ListLoading() {
  return (
    <div
      data-testid="playlist-fallback"
      id="playlist-fallback"
      className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth"
    >
      <div className="flex h-auto w-full flex-col items-center justify-start border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 p-3 sm:h-[23.5dvh] sm:px-4">
        <div className="flex h-auto w-full flex-col items-start justify-start pt-1 sm:flex-row sm:items-center sm:pt-1.5">
          <div className="mr-4 h-[150px] w-[150px] animate-pulse bg-neutral-500"></div>
          <div className="text-md mt-2 h-4 w-[60%] rounded-sm bg-neutral-500 sm:h-7 sm:w-[40%] sm:text-3xl"></div>
        </div>
        <div className="flex h-auto w-full items-center justify-between">
          <div className="flex h-auto w-[50%] flex-col items-start justify-center sm:mt-1 sm:w-[30%]">
            <div className="my-2 h-3 w-[90%] rounded-sm bg-neutral-500 leading-tight sm:mt-1 sm:line-clamp-2"></div>
            <div className="mr-2 h-3 w-32 rounded-sm bg-neutral-500"></div>
          </div>
          <div className="mr-1 flex w-[170px] items-center justify-between sm:mr-0">
            <div className="-mr-1 h-6 w-6 rounded-sm bg-neutral-500 p-0"></div>
            <div className="h-6 w-6 rounded-sm bg-neutral-500"></div>
            <div className="h-6 w-6 rounded-sm bg-neutral-500"></div>
            <div className="h-9 w-9 rounded-full bg-neutral-400"></div>
          </div>
        </div>
      </div>
      <ul className="flex h-auto min-h-[71.5dvh] w-full flex-col items-start justify-start bg-neutral-900 p-3 pb-28 sm:p-4 sm:pb-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <SongFallback key={i} isWidgetSong={false} />
        ))}
      </ul>
    </div>
  );
}
