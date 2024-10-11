import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, getProfile } from "../store/authSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { dateCountdown } from "../utils/dateFormat";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, loadingUser, user, errorMessage } = useSelector(
    (state) => state.auth
  );
  const [timer, setTimer] = useState(
    Math.floor(jwtDecode(token.accessToken)?.exp - Date.now() / 1000)
  );

  let interval = useRef();

  if (timer <= 0) {
    clearInterval(interval.current);
  }

  function handleReset() {
    dispatch(getProfile(token.accessToken));
  }

  useEffect(() => {
    dispatch(getProfile(token.accessToken));

    interval.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (errorMessage) {
      localStorage.removeItem("token");
      dispatch(clearMessage());
      navigate("/login");
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [errorMessage, token]);

  if (loadingUser) return <div>Loading...</div>;

  if (user)
    return (
      <div className="container max-w-[1280px] mx-auto py-4">
        <div className="flex items-center">
          <img src={user?.image} alt={user?.username} />
          <span className="text-3xl font-bold">{user?.username}</span>
        </div>
        <div>{dateCountdown(timer)}</div>
        <button
          onClick={handleReset}
          className="border bg-indigo-500 text-white px-5 py-2 mt-5"
        >
          Reset
        </button>
      </div>
    );
}

export default Profile;
