export interface Honorario {
  id: number;
  contratoId: number;
  advogadoNome: string;
  clienteNome: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
}

export interface HonorarioRequest {
  contratoId: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
}
