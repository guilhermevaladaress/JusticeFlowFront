export interface TipoProcesso {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Tribunal {
  id: number;
  nome: string;
  sigla: string;
  tipo: string;
  estado?: string;
}

export interface Vara {
  id: number;
  tribunalId: number;
  nome: string;
  numero: number;
  competencia?: string;
}

export interface Processo {
  id: number;
  numeroProcesso: string;
  titulo: string;
  descricao?: string;
  status: string;
  dataAbertura: string;
  dataEncerramento?: string;
  tipoProcessoId: number;
  tipoProcessoNome: string;
  tribunalId: number;
  tribunalNome: string;
  varaId?: number;
  varaNome?: string;
  advogados: string[];
  clientes: string[];
}

export interface ProcessoRequest {
  numeroProcesso: string;
  titulo: string;
  descricao?: string;
  dataAbertura: string;
  tipoProcessoId: number;
  tribunalId: number;
  varaId?: number;
}

export interface ProcessoStatusRequest {
  status: string;
}

export interface ProcessoAdvogado {
  advogadoId: number;
  advogadoNome: string;
  numeroOAB: string;
  tipoVinculo: string;
  dataVinculo: string;
  ativo: boolean;
}

export interface ProcessoCliente {
  clienteId: number;
  clienteNome: string;
  tipoParte: string;
  dataVinculo: string;
}

export interface VincularAdvogadoRequest {
  advogadoId: number;
  tipoVinculo: string;
}

export interface VincularClienteRequest {
  clienteId: number;
  tipoParte: string;
}
