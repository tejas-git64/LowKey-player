import { Link, useNavigate } from "react-router-dom";
import reactlogo from "../../assets/svgs/react.svg";
import tailwindlogo from "../../assets/svgs/tailwindcss.svg";
import bg480 from "../../assets/images/landing/landing-480px.webp";
import bg640 from "../../assets/images/landing/landing-640px.webp";
import bg768 from "../../assets/images/landing/landing-768px.webp";
import bg1024 from "../../assets/images/landing/landing-1024px.webp";
import bg1280 from "../../assets/images/landing/landing-1280px.webp";
import bg1536 from "../../assets/images/landing/landing-1536px.webp";
import { useEffect, useState } from "react";

export default function Intro() {
  const navigate = useNavigate();
  const [bgImg, setBgImg] = useState<string>("");

  function imageResize() {
    switch (true) {
      case innerWidth <= 480:
        setBgImg(bg480);
        break;
      case innerWidth <= 640:
        setBgImg(bg640);
        break;
      case innerWidth <= 768:
        setBgImg(bg768);
        break;
      case innerWidth <= 1024:
        setBgImg(bg1024);
        break;
      case innerWidth <= 1280:
        setBgImg(bg1280);
        break;
      case innerWidth <= 2500:
        setBgImg(bg1536);
        break;
      default:
        setBgImg(bg1024);
        break;
    }
  }

  useEffect(() => {
    imageResize();
    window.addEventListener("load", imageResize);
    window.addEventListener("resize", imageResize);
    return () => {
      window.removeEventListener("load", imageResize);
      window.removeEventListener("resize", imageResize);
    };
  }, []);

  function toHome() {
    navigate("/home");
  }

  return (
    <>
      <div
        style={{
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${bgImg})`,
        }}
        className="flex h-full w-full items-center shadow-inner shadow-black"
      >
        <div className="relative mx-auto flex h-auto w-[calc(100%-10%)] flex-col items-center rounded-lg bg-neutral-900 pt-4 font-mono sm:w-[550px]">
          <div className="flex h-20 w-full flex-col items-start justify-between pl-6">
            <h2 className="text-3xl font-semibold text-purple-500 xl:text-4xl">
              LowKey Music
            </h2>
            <h2 className="border-b border-purple-600 text-lg font-bold text-white md:text-xl">
              Features
            </h2>
          </div>
          <ul className="my-1 h-auto w-full list-disc border-neutral-900 px-10 text-left text-sm font-medium">
            <li className="my-2 text-white">
              Tracks from diverse artists/albums/playlists
            </li>
            <li className="my-2 text-white">
              Multi search artists/albums/playlists
            </li>
            <li className="my-2 text-white">
              Add favorites and playlist creation
            </li>
            <li className="my-2 text-white">
              Recent listening history support
            </li>
            <li className="my-2 text-white">Activity support</li>
          </ul>
          <div className="h-auto w-full px-6">
            <h2 className="mb-3 w-min whitespace-nowrap border-b border-purple-600 text-left text-lg font-bold text-white md:text-xl">
              Technologies used
            </h2>
            <ul className="flex h-auto w-full">
              <li className="flex h-auto w-auto items-center justify-start">
                <p className="flex h-auto w-auto items-center pr-1 text-left text-sm font-bold text-white">
                  React
                </p>
                <img src={reactlogo} className="h-4 w-4" alt="tech-icon" />
              </li>
              <li className="ml-3 flex h-auto w-auto items-center justify-start">
                <p className="flex h-auto w-auto items-center pr-1 text-left text-sm font-bold text-white">
                  TailwindCSS
                </p>
                <img src={tailwindlogo} className="h-4 w-4" alt="tech-icon" />
              </li>
              <li className="ml-3 flex h-auto w-auto items-center justify-start">
                <p className="flex h-auto w-auto items-center pr-1 text-left text-sm font-bold text-white">
                  Vite
                </p>
                <img src="/vite.svg" className="h-4 w-4" alt="tech-icon" />
              </li>
            </ul>
          </div>
          <div className="flex h-auto w-full items-center justify-evenly py-4">
            <Link
              to="/home"
              onClick={toHome}
              className="transition-bg h-auto w-auto rounded-lg border-none bg-[#a855f7] p-2 px-4 text-sm font-extrabold transition-colors duration-200 text-black hover:bg-teal-500 hover:text-black"
            >
              Check it out
            </Link>
          </div>
          <footer className="h-auto w-full border-t-[1px] border-neutral-900">
            <p className="py-2 text-center text-sm font-medium text-neutral-400">
              Made with 💖 by{"\t"}
              <a
                href="https://github.com/tejas-git64"
                className="font-bold text-teal-500"
              >
                Tej
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
