import { useNavigate } from "react-router-dom";
import back from "../../assets/svgs/icons8-back.svg";
import next from "../../assets/svgs/icons8-next.svg";

export default function RouteNav() {
  const navigate = useNavigate();

  return (
    <div className="max-w-auto ml-2 flex w-[45px] flex-shrink-0 items-center justify-between sm:w-[60px]">
      <button
        onClick={() => navigate(-1)} // go to previous page
        className="bg-transparent p-0"
      >
        <img src={back} alt="back" className="h-6 w-6 hover:invert" />
      </button>
      <button
        onClick={() => navigate(1)} //go to next page
        className="bg-transparent p-0"
      >
        <img src={next} alt="next" className="h-6 w-6 hover:invert" />
      </button>
    </div>
  );
}
