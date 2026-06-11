import { http, setToken, clearToken } from "./http";

function mapUsuario(dto) {
  return {
    id: dto.id ?? "",
    nome: dto.nomeCompleto ?? dto.nome ?? "",
    nomeCompleto: dto.nomeCompleto ?? dto.nome ?? "",
    email: dto.email,
    perfil: dto.role ?? dto.perfil,
  };
}

export async function login(email, senha) {
  if (!email || !senha) throw new Error("Informe e-mail e senha.");
  const resp = await http.post("/auth/login", { email, senha }, { auth: false });
  setToken(resp.token);
  return mapUsuario(resp);
}

export function logout() {
  clearToken();
}

export async function register(dados) {
  return http.post("/auth/register", dados, { auth: false });
}
