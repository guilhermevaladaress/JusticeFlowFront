export interface DashboardData {
  processosAtivos: number;
  audienciasHoje: number;
  prazosVencendo: number;
  totalDocumentos: number;
  totalClientes: number;
  totalAdvogados: number;
  honariosAtrasados: number;
  processosEncerrados: number;
  audienciasMes: number;
  prazosCumpridos: number;
  novosClientesMes: number;
  prazosProximos: PrazoResumo[];
  audienciasProximas: AudienciaResumo[];
  processosRecentes: ProcessoResumo[];
}

export interface PrazoResumo {
  id: number;
  descricao: string;
  processoTitulo: string;
  dataVencimento: string;
  status: string;
}

export interface AudienciaResumo {
  id: number;
  processoTitulo: string;
  tipoAudienciaNome: string;
  dataHora: string;
  status: string;
}

export interface ProcessoResumo {
  id: number;
  numero: string;
  titulo: string;
  areaDireito: string;
  status: string;
}

/** Grupo genérico de contagem retornado pelos relatórios (camelCase do backend). */
export interface GrupoStatus {
  status: string;
  total: number;
}

export interface GrupoTipo {
  tipo: string;
  total: number;
}

export interface RelatorioProcessos {
  total: number;
  porStatus: GrupoStatus[];
  porTipo: GrupoTipo[];
}

export interface RelatorioPrazos {
  total: number;
  porStatus: GrupoStatus[];
  vencidos: number;
  vencendoEm7Dias: number;
}

export interface RelatorioAudiencias {
  total: number;
  porStatus: GrupoStatus[];
  porTipo: GrupoTipo[];
}

export interface RelatorioHonorarios {
  total: number;
  valorTotal: number;
  valorRecebido: number;
  valorPendente: number;
  valorAtrasado: number;
  porStatus: { status: string; total: number; valor: number }[];
}
