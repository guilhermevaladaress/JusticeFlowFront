import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AUTH_ATIVA } from "../authConfig";

export default function RequireAuth({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();
  if (AUTH_ATIVA && !usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
