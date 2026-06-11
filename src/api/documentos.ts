import api from './axios';
import type { Documento, DocumentoRequest, DocumentoArquivo, TipoDocumento } from '../types/documento';

export const documentosApi = {
  listar: () => api.get<Documento[]>('/documentos'),
  detalhar: (id: number) => api.get<Documento>(`/documentos/${id}`),
  arquivo: (id: number) => api.get<DocumentoArquivo>(`/documentos/${id}/arquivo`),
  upload: (data: DocumentoRequest) => api.post<Documento>('/documentos', data),
  atualizar: (id: number, data: Partial<DocumentoRequest>) => api.put<Documento>(`/documentos/${id}`, data),
  arquivar: (id: number) => api.delete(`/documentos/${id}`),
  listarTipos: () => api.get<TipoDocumento[]>('/tipos-documento'),
};
