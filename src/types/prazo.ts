export interface TipoPrazo {
  id: number;
  nome: string;
  diasDefault: number;
  descricao?: string;
}

export interface Prazo {
  id: number;
  processoId: number;
  numeroProcesso: string;
  processoTitulo: string;
  tipoPrazoId: number;
  tipoPrazoNome: string;
  descricao: string;
  dataVencimento: string;
  dataCumprimento?: string;
  status: string;
  observacoes?: string;
  advogadoId?: number;
  advogadoNome?: string;
}

export interface PrazoRequest {
  processoId: number;
  tipoPrazoId: number;
  descricao: string;
  dataVencimento: string;
  observacoes?: string;
  advogadoId?: number;
}
