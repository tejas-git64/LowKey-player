import { useNavigate } from "react-router-dom";
import back from "../../assets/svgs/icons8-back.svg";
import next from "../../assets/svgs/icons8-next.svg";

export default function RouteNav() {
  const navigate = useNavigate();

  return (
    <div className="max-w-auto flex w-[55px] flex-shrink-0 items-center justify-between sm:w-[60px]">
      <button
        tabIndex={0}
        onClick={() => navigate(-1)} // go to previous page
        className="group bg-transparent p-0"
      >
        <img
          src={back}
          alt="back"
          className="h-6 w-6 rounded-full hover:invert group-focus:ring-2 group-focus:ring-emerald-500"
        />
      </button>
      <button
        tabIndex={0}
        onClick={() => navigate(1)} //go to next page
        className="group bg-transparent p-0"
      >
        <img
          src={next}
          alt="next"
          className="h-6 w-6 rounded-full hover:invert group-focus:ring-2 group-focus:ring-emerald-500"
        />
      </button>
    </div>
  );
}
