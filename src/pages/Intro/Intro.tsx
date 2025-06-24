import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import reactlogo from "../../assets/svgs/react.svg";
import tailwindlogo from "../../assets/svgs/tailwindcss.svg";
import bg480 from "../../assets/images/landing/landing-480px.webp";
import bg640 from "../../assets/images/landing/landing-640px.webp";
import bg768 from "../../assets/images/landing/landing-768px.webp";
import bg1024 from "../../assets/images/landing/landing-1024px.webp";
import bg1280 from "../../assets/images/landing/landing-1280px.webp";
import bg1536 from "../../assets/images/landing/landing-1536px.webp";

const sizes = `
  (max-width: 480px) 480px,
  (max-width: 640px) 640px,
  (max-width: 768px) 768px,
  (max-width: 1024px) 1024px,
  (max-width: 1280px) 1280px,
  (max-width: 1536px) 1536px
`;

const srcSet = `
  ${bg480} 480w,
  ${bg640} 640w,
  ${bg768} 768w,
  ${bg1024} 1024w,
  ${bg1280} 1280w,
  ${bg1536} 1536w
`;

export default function Intro() {
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  function fadeOutNavigate() {
    imageRef.current?.classList.remove("intro-fadein");
    cardRef.current?.classList.remove("card-fadein");
    imageRef.current?.classList.add("intro-fadeout");
    cardRef.current?.classList.add("card-fadeout");
    btnRef.current?.classList.remove("intro-fadein");
    btnRef.current?.classList.add("intro-fadeout");
    setTimeout(() => {
      navigate("/home");
    }, 500);
  }

  useEffect(() => {
    setTimeout(() => {
      imageRef.current?.classList.remove("intro-fadeout");
      cardRef.current?.classList.remove("card-fadeout");
      btnRef.current?.classList.remove("intro-fadeout");
      imageRef.current?.classList.add("intro-fadein");
      cardRef.current?.classList.add("card-fadein");
      btnRef.current?.classList.add("intro-fadein");
    }, 10);
  }, []);

  return (
    <>
      <div className="relative flex h-full w-full items-center shadow-inner shadow-black">
        <img
          ref={imageRef}
          src={bg768}
          srcSet={srcSet}
          sizes={sizes}
          alt="background-image"
          loading="eager"
          fetchPriority="high"
          className="intro-fadeout absolute left-0 top-0 h-full w-full object-cover transition-all duration-500 ease-in-out"
        />
        <div
          ref={cardRef}
          className="card-fadeout relative mx-auto flex h-auto w-[calc(100%-5%)] flex-col items-center border border-[#ffffff25] bg-[#0000004f] px-4 py-4 backdrop-blur-md transition-all duration-500 ease-in-out sm:w-[430px] md:px-5"
        >
          <h2 className="w-full bg-gradient-to-r from-purple-400 via-teal-500 to-cyan-400 bg-clip-text pl-1.5 text-left text-3xl font-semibold text-transparent xl:text-4xl">
            Lowkey Music
          </h2>
          <div className="my-4 flex h-auto w-full flex-col items-start justify-between">
            <h2 className="group cursor-pointer pl-2 text-lg font-medium text-white">
              Features
              <span className="ml-1 opacity-0 transition-opacity duration-100 ease-linear group-hover:opacity-100">
                ✨
              </span>
            </h2>
            <ul className="h-auto w-full list-disc border-neutral-900 pl-6 text-left text-sm">
              <li className="my-2 cursor-pointer font-medium tracking-wider text-neutral-400 transition-colors ease-linear hover:text-white">
                Tracks from diverse artists/albums/playlists
              </li>
              <li className="my-2 cursor-pointer font-medium tracking-wider text-neutral-400 transition-colors ease-linear hover:text-white">
                Multi search artists/albums/playlists
              </li>
              <li className="my-2 cursor-pointer font-medium tracking-wider text-neutral-400 transition-colors ease-linear hover:text-white">
                Add favorites and playlist creation
              </li>
              <li className="my-2 cursor-pointer font-medium tracking-wider text-neutral-400 transition-colors ease-linear hover:text-white">
                Recent listening history support
              </li>
              <li className="my-2 cursor-pointer font-medium tracking-wider text-neutral-400 transition-colors ease-linear hover:text-white">
                Activity support
              </li>
            </ul>
          </div>
          <div className="mb-4 h-auto w-full pl-2">
            <h2 className="group mb-1 w-min cursor-pointer whitespace-nowrap text-lg font-medium text-white">
              Built with
              <span className="ml-1 opacity-0 transition-opacity duration-100 ease-linear group-hover:opacity-100">
                🔨
              </span>
            </h2>
            <ul className="flex h-auto w-full">
              <li className="group flex h-auto w-auto cursor-pointer items-center justify-start">
                <p className="flex h-auto w-auto items-center pr-1 text-left text-sm font-medium text-white transition-colors duration-100 ease-linear group-hover:text-cyan-400">
                  React
                </p>
                <img
                  src={reactlogo}
                  loading="eager"
                  fetchPriority="high"
                  className="h-[15px] w-[15px] saturate-0 transition-all duration-100 ease-in group-hover:rotate-45 group-hover:saturate-100"
                  alt="tech-icon"
                />
              </li>
              <li className="group ml-3 flex h-auto w-auto cursor-pointer items-center justify-start">
                <p className="flex h-auto w-auto items-center pr-1 text-left text-sm font-medium text-white transition-colors duration-100 ease-linear group-hover:text-[#5affff]">
                  TailwindCSS
                </p>
                <img
                  src={tailwindlogo}
                  loading="eager"
                  fetchPriority="high"
                  className="h-[18px] w-[18px] saturate-0 transition-colors duration-100 ease-in group-hover:saturate-100"
                  alt="tech-icon"
                />
              </li>
              <li className="group ml-3.5 flex h-auto w-auto cursor-pointer items-center justify-start">
                <p className="flex h-auto w-auto items-center pr-1 text-left text-sm font-medium tracking-wide text-white transition-colors duration-100 ease-linear group-hover:text-purple-400">
                  Vite
                </p>
                <img
                  src="/vite.svg"
                  loading="eager"
                  fetchPriority="high"
                  className="h-4 w-4 saturate-0 transition-colors duration-100 ease-in group-hover:saturate-100"
                  alt="tech-icon"
                />
              </li>
            </ul>
          </div>
          <div className="mb-4 flex h-auto w-full items-center justify-evenly">
            <button
              type="button"
              onClick={fadeOutNavigate}
              ref={btnRef}
              aria-label="Visit home"
              className="intro-fadeout h-auto w-auto rounded-sm bg-[#f8f8f836] px-6 py-2 text-sm font-semibold tracking-wide text-white transition-colors duration-200 ease-linear hover:bg-[#c74fffc2] hover:text-purple-950"
            >
              Check it out
            </button>
          </div>
          <footer className="flex h-auto w-full items-center justify-center border-neutral-900">
            <p className="mr-1 text-center text-sm font-medium text-neutral-400 transition-colors duration-100 ease-linear group-hover:text-white">
              Made with 💖 by
            </p>
            <a
              href="https://github.com/tejas-git64"
              className="text-sm text-white duration-100 ease-in hover:text-teal-400"
            >
              Tej
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
