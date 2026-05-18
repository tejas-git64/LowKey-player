export default function ErrorFallback({ message }: { message: string }) {
  return (
    <div
      data-testid="error-fallback"
      className="flex h-full w-full flex-col items-center justify-center space-y-8 bg-transparent"
    >
      <h1 className="mb-2 text-6xl font-semibold text-neutral-400">
        щ(゜ロ゜щ)
      </h1>
      <h2 className="text-center text-lg font-medium text-neutral-400">
        {message}
      </h2>
      <button
        onClick={() => globalThis.location.reload()}
        className="scale-95 animate-intro-fadein rounded-sm bg-black p-2.5 px-5 text-sm font-medium text-neutral-400 shadow-lg shadow-neutral-900 transition-all duration-150 ease-in hover:scale-100 hover:bg-neutral-400 hover:text-black"
      >
        Reload page
      </button>
    </div>
  );
}
