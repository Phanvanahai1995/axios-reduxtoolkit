// import { useSelector } from "react-redux";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function MainLayout() {
  const { token } = useSelector((store) => store.auth);

  return <main>{token ? <Outlet /> : <Navigate to="/login" />}</main>;
}

export default MainLayout;
