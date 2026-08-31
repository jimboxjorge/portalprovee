import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const sesion = sessionStorage.getItem("sesion");

  if (!sesion) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;