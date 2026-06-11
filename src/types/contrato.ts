export interface Contrato {
  id: number;
  advogadoId: number;
  advogadoNome: string;
  clienteId: number;
  clienteNome: string;
  dataAssinatura: string;
  dataValidade?: string;
  valorHonorarios: number;
  formaPagamento: string;
  status: string;
}

export interface ContratoRequest {
  advogadoId: number;
  clienteId: number;
  dataAssinatura: string;
  dataValidade?: string;
  valorHonorarios: number;
  formaPagamento: string;
  status?: string;
}
