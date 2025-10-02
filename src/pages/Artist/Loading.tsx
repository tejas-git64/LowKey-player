import SongFallback from "../../components/Song/SongFallback";

export const ArtistInfoFallback = () => {
  return (
    <div data-testid="artist-fallback" className="h-full w-full bg-neutral-900">
      <div className="flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-black p-4 sm:flex-row sm:items-end sm:justify-between sm:bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]">
        <div className="flex h-full min-w-[80%] flex-col items-center justify-center text-center sm:h-full sm:w-[70%] sm:flex-row sm:justify-start sm:text-left">
          <div className="h-[150px] w-[150px] animate-pulse bg-neutral-400 sm:mr-4"></div>
          <div className="flex flex-col items-center justify-center sm:items-start">
            <div className="flex h-fit w-full items-center justify-center sm:justify-start">
              <div className="my-4 mb-3.5 h-[22px] w-60 overflow-hidden whitespace-pre-line rounded-sm bg-neutral-400 text-center text-3xl sm:my-0 sm:mb-2 sm:ml-0 sm:h-[25px] sm:w-64"></div>
            </div>
            <div className="my-1 mb-2 h-3 w-32 rounded-sm bg-neutral-500 leading-5"></div>
            <div className="h-3 w-24 rounded-sm bg-neutral-500"></div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-between sm:h-[150px] sm:items-end">
          <ul className="-mb-1 mr-0.5 mt-4 flex h-full w-[45%] items-center justify-evenly sm:my-1.5 sm:w-fit sm:items-end sm:justify-end">
            <li className="h-[24px] w-[28px] rounded-sm bg-neutral-400 sm:h-[24px] sm:w-[24px]"></li>
            <li className="mx-4 h-[24px] w-[28px] rounded-sm bg-neutral-400 sm:h-[24px] sm:w-[24px]"></li>
            <li className="h-[24px] w-[28px] rounded-sm bg-neutral-400 sm:h-[24px] sm:w-[24px]"></li>
          </ul>
          <div
            className={`ease -m-0.5 mt-[16px] h-[33px] w-[100px] rounded-sm bg-neutral-500 transition-all sm:mx-0 sm:mt-1.5 sm:h-[50px] sm:w-[103px]`}
          ></div>
        </div>
      </div>
      {/* Artist Albums */}
    </div>
  );
};

export const ArtistAlbumFallback = () => {
  return (
    <div
      data-testid="artist-album-fallback"
      className="h-[240px] w-full px-4 py-3 pb-12"
    >
      <h2 className="text-xl font-semibold text-white">Albums</h2>
      <ul className="mx-auto mt-2.5 flex h-full w-full items-center justify-start overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="mr-4 h-[180px] w-[150px] flex-shrink-0 animate-pulse"
          >
            <div className="h-[150px] w-[150px] bg-neutral-500"></div>
            <div className="mt-1 h-3 w-[150px] rounded-sm bg-neutral-600"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ArtistSongsFallback = () => {
  return (
    <div
      data-testid="artist-songs-fallback"
      className="h-auto max-h-fit w-full px-4 py-2 pb-4"
    >
      <h2 className="pb-2 text-xl font-semibold text-white">Songs</h2>
      <ul className="max-h-auto mx-auto mt-1 h-auto w-full overflow-hidden bg-neutral-900">
        {Array.from({ length: 7 }).map((_, i) => (
          <SongFallback key={i} isWidgetSong={false} />
        ))}
      </ul>
    </div>
  );
};
