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
