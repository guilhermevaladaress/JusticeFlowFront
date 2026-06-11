export interface TipoAudiencia {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Audiencia {
  id: number;
  processoId: number;
  numeroProcesso: string;
  processoTitulo: string;
  tipoAudienciaId: number;
  tipoAudienciaNome: string;
  dataHora: string;
  local?: string;
  linkVirtual?: string;
  status: string;
  observacoes?: string;
}

export interface AudienciaRequest {
  processoId: number;
  tipoAudienciaId: number;
  dataHora: string;
  local?: string;
  linkVirtual?: string;
  observacoes?: string;
}

export interface AudienciaStatusRequest {
  status: string;
}
