import { useState, useCallback } from "react";
import { login as loginService, logout as logoutService } from "../services/auth";
import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "justiceflow_usuario";

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const entrar = useCallback(async (email, senha) => {
    const u = await loginService(email, senha);
    setUsuario(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  }, []);

  const sair = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
    logoutService();
  }, []);

  const atualizar = useCallback((dados) => {
    setUsuario((u) => {
      const novo = { ...u, ...dados };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
      return novo;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair, atualizar }}>
      {children}
    </AuthContext.Provider>
  );
}
