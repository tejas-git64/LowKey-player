import nf480 from "../../assets/images/notfound/notfound-480px.webp";
import nf640 from "../../assets/images/notfound/notfound-640px.webp";
import nf768 from "../../assets/images/notfound/notfound-landscape-768px.webp";
import nf1024 from "../../assets/images/notfound/notfound-landscape-1024px.webp";
import nf1280 from "../../assets/images/notfound/notfound-landscape-1280px.webp";
import nf1536 from "../../assets/images/notfound/notfound-landscape-1536px.webp";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { animateScreen } from "../../helpers/animateScreen";

export default function NotFound() {
  const [nfImg, setNfImg] = useState<string>("");
  const nfEl = useRef<HTMLImageElement>(null);

  function imageResize() {
    switch (true) {
      case innerWidth <= 480:
        setNfImg(nf480);
        break;
      case innerWidth <= 640:
        setNfImg(nf640);
        break;
      case innerWidth <= 768:
        setNfImg(nf768);
        break;
      case innerWidth <= 1024:
        setNfImg(nf1024);
        break;
      case innerWidth <= 1280:
        setNfImg(nf1280);
        break;
      case innerWidth <= 2500:
        setNfImg(nf1536);
        break;
      default:
        setNfImg(nf1024);
        break;
    }
  }

  useEffect(() => {
    animateScreen(nfEl);
    imageResize();
    window.addEventListener("load", imageResize);
    window.addEventListener("resize", imageResize);
    return () => {
      window.removeEventListener("load", imageResize);
      window.removeEventListener("resize", imageResize);
    };
  }, []);

  return (
    <>
      <div
        data-testid="notfound"
        ref={nfEl}
        style={{
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${nfImg})`,
        }}
        className="home-fadeout flex h-full w-full items-center justify-center shadow-inner shadow-black duration-200 ease-in"
      >
        <div className="flex h-[80%] w-[80%] flex-col items-center justify-around sm:h-full">
          <div className="text-center">
            <h1 className="text-8xl font-extrabold text-black sm:text-9xl sm:text-neutral-950">
              404
            </h1>
            <p className="font-medium text-black sm:text-lg sm:font-semibold sm:text-neutral-900">
              Page not found
            </p>
          </div>
          <Link
            to={"/home"}
            className="sm:text-md rounded-full bg-white p-2 px-6 text-sm text-black hover:text-black sm:bg-black sm:px-8 sm:py-3 sm:text-neutral-500 sm:hover:text-neutral-500"
          >
            Go home
          </Link>
        </div>
      </div>
    </>
  );
}
