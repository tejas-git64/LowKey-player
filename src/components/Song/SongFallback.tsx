export default function SongFallback() {
  return (
    <li className="mb-0.5 h-12 w-full flex-shrink-0 animate-pulse overflow-hidden rounded-sm text-sm">
      <div
        style={{
          border: "none",
          outline: "none",
        }}
        className="flex h-full w-full items-center justify-between bg-neutral-700 p-0 pr-2"
      >
        <div className="mr-4 h-[50px] w-[50px] bg-neutral-400 md:mr-[5%]"></div>
        <p className="h-[14px] w-[35%] rounded-md bg-neutral-500 sm:leading-5 md:w-[30%]"></p>
        <div className="mr-4 h-[20px] w-[20px]"></div>
        <div className="md:w-34 h-[14px] w-28 rounded-md bg-neutral-500 leading-4 sm:flex sm:w-[20%] 2xl:w-56"></div>
        <div className="hidden h-[14px] w-10 rounded-md bg-neutral-500 leading-4 sm:block"></div>
        <div className="h-3 w-[50px] rounded-md bg-neutral-700 md:w-[50px] lg:w-[60px]"></div>
      </div>
    </li>
  );
}
