import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [valueLogin, setValueLogin] = useState({
    username: "",
    password: "",
  });

  const { successMessage, errorMessage, token } = useSelector(
    (store) => store.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    setValueLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    dispatch(
      login({
        ...valueLogin,
        expiresInMins: 30,
      })
    );

    // console.log(valueLogin);
  }

  useEffect(() => {
    if (successMessage) {
      //   console.log("ok");
      navigate("/");
      dispatch(clearMessage());
    }

    if (token) {
      navigate("/");
    }

    if (errorMessage) {
      console.log(errorMessage);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="container h-[100vh] flex justify-center items-center mx-auto ">
      <form
        onSubmit={handleLogin}
        className="w-[400px] flex flex-col gap-6 border border-slate-500 p-8 bg-sky-400"
        action=""
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="">Username</label>
          <input
            value={valueLogin.username}
            className="border border-slate-400 p-2 rounded-sm"
            name="username"
            type="text"
            placeholder="Username..."
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Password</label>
          <input
            value={valueLogin.password}
            className="border border-slate-400 p-2 rounded-sm"
            name="password"
            type="password"
            placeholder="Password..."
            onChange={handleChange}
          />
        </div>
        <button className="bg-orange-500 py-2 text-white">Login</button>
      </form>
    </div>
  );
}

export default Login;
