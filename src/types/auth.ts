export interface User {
  id: string;
  email: string;
  nomeCompleto: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nomeCompleto: string;
  email: string;
  role: string;
  expiracao: string;
}

export interface RegisterRequest {
  nomeCompleto: string;
  email: string;
  cpf?: string;
  senha: string;
  role: string;
  telefone?: string;
  dataNascimento?: string;
  numeroOAB?: string;
  uf?: string;
  especialidade?: string;
}
