import SongFallback from "../../components/Song/SongFallback";

export default function ListLoading() {
  return (
    <div className="h-full w-full animate-pulse overflow-x-hidden overflow-y-scroll scroll-smooth">
      <div className="flex h-auto w-full flex-col items-center justify-center border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 p-3 sm:h-[23.5dvh] sm:px-4">
        <div className="flex h-auto w-full flex-col items-start justify-start pt-1 sm:flex-row sm:items-center sm:pt-1.5">
          <div className="mr-4 h-[150px] w-[150px] bg-neutral-500"></div>
          <div className="mb-1 mt-3.5 h-[16px] w-[50%] rounded-full bg-neutral-400 sm:line-clamp-3 sm:h-[30px] sm:w-[40%] sm:leading-9"></div>
        </div>
        <div className="flex h-auto w-full items-center justify-between">
          <div className="flex h-auto w-[50%] flex-col items-start justify-center sm:mt-1 sm:w-[30%]">
            <div className="my-2 mb-0 h-[13px] w-[90%] rounded-full bg-neutral-500 leading-tight sm:line-clamp-2"></div>
            <div className="mb-1 mt-3 h-[13px] w-32 rounded-full bg-neutral-500"></div>
          </div>
          <div className="flex h-auto w-[180px] items-center justify-between">
            <div className="rounded-ful h-[28px] w-[28px] rounded-full bg-neutral-500 p-0"></div>
            <div className="h-[28px] w-[28px] rounded-full bg-neutral-500 p-0"></div>
            <div className="h-[28px] w-[28px] rounded-md bg-neutral-500 p-0"></div>
            <div className="h-[41px] w-[41px] rounded-full bg-neutral-400"></div>
          </div>
        </div>
      </div>
      <ul className="flex h-auto w-full flex-col items-start justify-start bg-neutral-900 px-3 py-2">
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
        <SongFallback />
      </ul>
    </div>
  );
}
