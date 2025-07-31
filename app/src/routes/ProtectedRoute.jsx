import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute() {
  const { userId } = useContext(AuthContext);
  return userId ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;