import api from './axios';
import type { Tribunal, Vara } from '../types/processo';

export const tribunaisApi = {
  listar: () => api.get<Tribunal[]>('/tribunais'),
  detalhar: (id: number) => api.get<Tribunal>(`/tribunais/${id}`),
  criar: (data: Omit<Tribunal, 'id'>) => api.post<Tribunal>('/tribunais', data),
  atualizar: (id: number, data: Omit<Tribunal, 'id'>) => api.put<Tribunal>(`/tribunais/${id}`, data),
  remover: (id: number) => api.delete(`/tribunais/${id}`),
  importarCnj: () => api.post('/tribunais/importar-cnj', {}),
  listarVaras: (tribunalId: number) => api.get<Vara[]>(`/tribunais/${tribunalId}/varas`),
  criarVara: (tribunalId: number, data: Omit<Vara, 'id' | 'tribunalId'>) =>
    api.post<Vara>(`/tribunais/${tribunalId}/varas`, data),
};
