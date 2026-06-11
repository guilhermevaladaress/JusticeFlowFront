export interface TipoDocumento {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Documento {
  id: number;
  processoId: number;
  numeroProcesso: string;
  tipoDocumentoId: number;
  tipoDocumentoNome: string;
  nome: string;
  descricao?: string;
  nomeArquivo: string;
  mimeType: string;
  dataUpload: string;
  uploadUsuarioNome: string;
  status: string;
}

export interface DocumentoRequest {
  processoId: number;
  tipoDocumentoId: number;
  nome: string;
  descricao?: string;
  nomeArquivo: string;
  conteudoBase64: string;
  mimeType: string;
}

export interface DocumentoArquivo {
  conteudoBase64: string;
  mimeType: string;
  nomeArquivo: string;
}
