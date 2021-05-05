import { useRef } from "react";
import useStore from "../../store/useStore";

const TestUser = () => {
  const ref = useRef(null);

  const loginAsGuest = useStore((state) => state.loginAsGuest);
  return (
    <div
      className="absolute right-3 w-60 bg-gray-600 text-white z-10 p-4 animate"
      ref={ref}
    >
      <div className="flex justify-end mx-auto cursor-pointer hover:opacity-10">
        <div
          className="w-7 h-6  relative text-5xl "
          onClick={() => (ref.current.style.display = "none")}
        >
          <div className="bar absolute origin-center transform rotate-45"></div>
          <div className="bar absolute origin-center transform -rotate-45"></div>
        </div>
      </div>
      <p>
        Don’t want to register? <br />
        click this button to log in automatically as an admin
      </p>
      <button
        className="bg-gray-400 py-1 px-4 rounded capitalize mt-3 hover:bg-gray-300"
        onClick={loginAsGuest}
      >
        log in
      </button>
    </div>
  );
};

export default TestUser;
