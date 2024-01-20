import { useNavigate } from "react-router-dom";
import back from "../../assets/icons8-back.svg";
import next from "../../assets/icons8-next.svg";

export default function RouteNav() {
  const navigate = useNavigate();

  return (
    <div className="max-w-auto ml-2 flex w-[65px] flex-shrink-0 items-center justify-between sm:w-[70px]">
      <button
        onClick={() => navigate(-1)} // go to previous page
        style={{
          border: "none",
          outline: "none",
        }}
        className="bg-transparent p-0"
      >
        <img src={back} alt="back" className="h-[30px] w-[30px] hover:invert" />
      </button>
      <button
        onClick={() => navigate(1)} //go to next page
        style={{
          border: "none",
          outline: "none",
        }}
        className="bg-transparent p-0"
      >
        <img src={next} alt="next" className="h-[30px] w-[30px] hover:invert" />
      </button>
    </div>
  );
}
