import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AUTH_ATIVA } from "../authConfig";

export default function RequireRole({ roles, children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    if (!AUTH_ATIVA) return children;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(usuario.perfil)) {
    return (
      <div className="estado" style={{ padding: "80px 24px" }}>
        <p style={{ fontSize: "1.1rem", color: "#374151" }}>Acesso não autorizado.</p>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
