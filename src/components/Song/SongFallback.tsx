export default function SongFallback({
  isWidgetSong,
}: {
  isWidgetSong: boolean;
}) {
  return (
    <li
      data-testid="song-fallback"
      className="h-12 w-full flex-shrink-0 rounded-sm bg-neutral-800"
    >
      <div className="flex h-full w-full items-center justify-start border-b border-neutral-950 p-0 pr-2">
        <div className="mr-4 h-[50px] w-[50px] flex-shrink-0 animate-pulse bg-neutral-500"></div>
        <div
          data-testid="name"
          className={`${isWidgetSong ? "w-[10vw] sm:w-[18vw] md:w-[20vw] xmd:w-[22vw] lg:mr-[1vw] lg:w-[22vw] xl:w-[12.5vw] xxl:w-[13.5vw] 2xl:w-[15vw] 2xl:max-w-60" : "w-[40vw] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[30%] 2xl:w-60"} h-4 flex-shrink-0 flex-grow-[0.85] basis-12 animate-pulse rounded-sm bg-neutral-500`}
        ></div>
        <div className="mx-2 h-[20px] w-[20px] bg-transparent"></div>
        <div
          data-testid="artists"
          className={`${isWidgetSong ? "hidden flex-shrink-0 xlg:flex xlg:w-[3.5vw] xl:w-[5vw] xxl:w-[8.5vw] 2xl:w-[10vw] 2xl:max-w-40" : "hidden sm:mr-12 sm:inline-flex sm:w-[25%] md:mr-6 md:w-[27.5%] xmd:w-[37.5%] lg:mr-10 lg:w-[37.5%] xl:mr-[7%] xl:w-[25%] xxl:mr-[4%] xxl:w-[30%] 2xl:mr-14 2xl:w-[35%] 2xl:max-w-96"} mr-4 flex h-4 flex-shrink-0 animate-pulse space-x-3 overflow-hidden rounded-sm bg-neutral-500`}
        ></div>
        <div
          data-testid="duration"
          className={`${isWidgetSong ? "mr-[1vw] w-10 flex-shrink-0 sm:ml-[4vw] sm:mr-2 md:mx-[2vw] xmd:mx-[3vw] lg:mx-[1vw] xlg:ml-[1.5vw] xxl:mx-[0.5vw] 2xl:mx-2" : "m-[3vw] w-10 max-w-14 sm:ml-4 sm:mr-[2%] sm:block md:mx-[5%] xmd:mx-4 lg:mx-0 xlg:mx-[2vw] xl:mr-4"} h-4 animate-pulse rounded-sm bg-neutral-500`}
        ></div>
        <div className="mx-0 flex h-4 w-10 flex-grow-[0.08] basis-12 animate-pulse items-center justify-evenly space-x-3 rounded-sm bg-neutral-500 sm:w-6 md:ml-2 lg:mx-6 lg:w-12 xlg:mx-[1vw]"></div>
      </div>
    </li>
  );
}
