import SongFallback from "../../components/Song/SongFallback";

export default function Loading() {
  return (
    <>
      <div className="h-auto w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
        <div className="h-auto w-full pt-4 sm:pt-2 xl:w-full">
          <div className="mx-4 -mb-0.5 h-5 w-44 animate-pulse rounded-md bg-neutral-700 sm:hidden"></div>
          <div className="h-auto w-full px-3.5">
            <section className="relative mx-auto mb-7 mt-4 flex h-80 w-full animate-pulse flex-col overflow-hidden rounded-2xl bg-transparent sm:mt-3 sm:flex-row">
              <div className="h-full w-auto flex-shrink-0 bg-neutral-700 sm:z-10 sm:h-full sm:w-[320px] sm:rounded-xl"></div>
              <div className="absolute right-2.5 top-[105px] z-20 flex h-10 w-[95%] items-end justify-between sm:left-0 sm:top-[268px] sm:h-12 sm:w-[320px] sm:p-2 md:justify-end md:p-2 md:py-1">
                <div className="left-0 top-0 line-clamp-1 h-5 w-[80%] rounded-full bg-neutral-500 pl-1 text-xl font-bold sm:hidden"></div>
                <div className="-mb-1 rounded-full bg-neutral-300 p-[22px] sm:mb-0"></div>
              </div>
              <ul
                id="widget-container"
                className="absolute bottom-1.5 left-1.5 mx-auto h-[158px] w-[96.5%] list-none overflow-hidden rounded-xl bg-neutral-900 sm:static sm:ml-3 sm:mt-0 sm:h-full sm:w-[80%]"
              >
                <SongFallback />
                <SongFallback />
                <SongFallback />
                <SongFallback />
                <SongFallback />
                <SongFallback />
                <SongFallback />
                <SongFallback />
              </ul>
            </section>
          </div>
          <div className="mx-4 -mb-1 h-6 w-44 animate-pulse rounded-lg bg-neutral-700"></div>
          <div className="mx-auto my-4 mt-6 grid h-auto w-full grid-cols-2 grid-rows-2 gap-3 px-3.5 sm:gap-5">
            <div className="flex h-12 w-full animate-pulse overflow-hidden rounded-md bg-neutral-800 sm:h-full">
              <div className="h-full w-12 bg-neutral-500 sm:w-14"></div>
              <div className="sm:text-md p-4">
                <div className="mt-0.5 h-3 w-28 rounded-lg bg-neutral-600 sm:mt-0 sm:h-6"></div>
              </div>
            </div>
            <div className="flex h-12 w-full animate-pulse overflow-hidden rounded-md bg-neutral-800 sm:h-full">
              <div className="h-full w-12 bg-neutral-500 sm:w-14"></div>
              <div className="sm:text-md p-4">
                <div className="mt-0.5 h-3 w-28 rounded-lg bg-neutral-600 sm:mt-0 sm:h-6"></div>
              </div>
            </div>
            <div className="flex h-12 w-full animate-pulse overflow-hidden rounded-md bg-neutral-800 sm:h-full">
              <div className="h-full w-12 bg-neutral-500 sm:w-14"></div>
              <div className="sm:text-md p-4">
                <div className="mt-0.5 h-3 w-28 rounded-lg bg-neutral-600 sm:mt-0 sm:h-6"></div>
              </div>
            </div>
            <div className="flex h-12 w-full animate-pulse overflow-hidden rounded-md bg-neutral-800 sm:h-full">
              <div className="h-full w-12 bg-neutral-500 sm:w-14"></div>
              <div className="sm:text-md p-4">
                <div className="mt-0.5 h-3 w-28 rounded-lg bg-neutral-600 sm:mt-0 sm:h-6"></div>
              </div>
            </div>
          </div>
          {/* Trending */}
          <div className="flex h-auto w-full animate-pulse flex-col bg-transparent py-3">
            <div className="ml-4 h-[20px] w-28 rounded-md bg-neutral-500 px-4 pb-1"></div>
            <ul className="flex h-48 w-full overflow-hidden whitespace-nowrap p-4">
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
            </ul>
          </div>
          {/* Playlists */}
          <div className="flex h-auto w-full animate-pulse flex-col overflow-x-hidden bg-transparent py-2">
            <div className="ml-4 h-[20px] w-44 rounded-md bg-neutral-500 px-4 py-1"></div>
            <ul className="flex h-48 w-full overflow-hidden whitespace-nowrap p-4">
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
              <li className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
                <div className="line-clamp-1 h-[150px] w-full bg-neutral-500"></div>
                <div className="mt-2 line-clamp-1 h-3 w-full rounded-full bg-neutral-700"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
