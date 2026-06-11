export interface Movimentacao {
  id: number;
  processoId: number;
  processoTitulo?: string;
  numeroProcesso?: string;
  usuario: string;
  dataHora: string;
  descricao: string;
  tipo: string;
}

export interface MovimentacaoRequest {
  processoId: number;
  descricao: string;
  tipo: string;
}
