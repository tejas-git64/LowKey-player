import SongFallback from "../../components/Song/SongFallback";

export const Widgetfallback = () => {
  return (
    <div
      data-testid="widget-fallback"
      className="h-auto max-h-max w-full px-3.5 sm:pt-0.5"
    >
      <section className="relative z-0 mx-auto mb-7 flex h-80 w-full flex-col overflow-hidden rounded-sm bg-neutral-900 sm:my-3 sm:h-[40vw] sm:flex-row sm:bg-transparent md:h-80">
        <div className="h-auto w-auto flex-shrink-0 cursor-pointer rounded-sm bg-neutral-700 duration-500 ease-in sm:z-10 sm:h-[40vw] sm:w-[40vw] md:h-80 md:w-80"></div>
        <div className="absolute right-2.5 top-[105px] z-20 flex h-auto w-[95%] items-end justify-between sm:-left-16 sm:top-[80%] sm:h-12 sm:w-[48vw] sm:justify-end sm:p-2 md:w-[370px] md:py-1">
          <div className="left-0 top-0 h-9 w-[80%] rounded-sm bg-neutral-500 pl-1 text-xl font-bold sm:hidden"></div>
          <div className="-mb-1 animate-pulse rounded-full bg-neutral-400 p-[22px] sm:mb-0"></div>
        </div>
        <ul
          id="widget-container"
          className="absolute bottom-1.5 left-[1.75%] h-[158px] w-[96.5%] list-none overflow-x-hidden overflow-y-scroll rounded-sm bg-neutral-900 sm:static sm:ml-3 sm:mt-0 sm:h-full"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SongFallback key={i} isWidgetSong={false} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export const TimelyFallback = () => {
  return (
    <div
      data-testid="timely-fallback"
      className="mx-auto mb-4 mt-1 grid h-auto w-full grid-cols-2 grid-rows-2 gap-3 px-3.5 sm:gap-5"
    >
      <div className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear sm:h-full">
        <div className="h-[50px] w-[50px] animate-pulse rounded-sm bg-neutral-500 sm:w-14"></div>
        <div className="mx-4 h-4 w-[50%] animate-pulse bg-neutral-600 sm:h-6"></div>
      </div>
      <div className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear sm:h-full">
        <div className="h-[50px] w-[50px] animate-pulse rounded-sm bg-neutral-500 sm:w-14"></div>
        <div className="mx-4 h-4 w-[50%] animate-pulse bg-neutral-600 sm:h-6"></div>
      </div>
      <div className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear sm:h-full">
        <div className="h-[50px] w-[50px] animate-pulse rounded-sm bg-neutral-500 sm:w-14"></div>
        <div className="mx-4 h-4 w-[50%] animate-pulse bg-neutral-600 sm:h-6"></div>
      </div>
      <div className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear sm:h-full">
        <div className="h-[50px] w-[50px] animate-pulse rounded-sm bg-neutral-500 sm:w-14"></div>
        <div className="mx-4 h-4 w-[50%] animate-pulse bg-neutral-600 sm:h-6"></div>
      </div>
    </div>
  );
};
