export interface Advogado {
  id: number;
  usuarioId: string;
  nomeCompleto: string;
  email: string;
  numeroOAB: string;
  uf: string;
  especialidade?: string;
  dataAdmissao: string;
  status: string;
}

export interface AdvogadoRequest {
  especialidade?: string;
  status?: string;
}

export interface CreateAdvogadoRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  numeroOAB: string;
  uf: string;
  especialidade?: string;
  cpf?: string;
  telefone?: string;
}
