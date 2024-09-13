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
        <p className="h-4 w-[35%] rounded-2xl bg-neutral-500 text-transparent md:w-[30%]">
          ""
        </p>
        <div className="mx-2 h-[20px] w-[20px] bg-transparent"></div>
        <p className="mr-4 h-4 w-32 overflow-hidden rounded-2xl bg-neutral-500 text-transparent sm:w-[20%] 2xl:w-56">
          "
        </p>
        <div className="hidden h-[14px] w-10 rounded-md bg-neutral-500 sm:block"></div>
        <div className="mx-1 ml-3 w-[55px] xl:ml-6"></div>
      </div>
    </li>
  );
}
