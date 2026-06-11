import api from './axios';
import type { Prazo, PrazoRequest, TipoPrazo } from '../types/prazo';

export const prazosApi = {
  listar: () => api.get<Prazo[]>('/prazos'),
  vencendo: () => api.get<Prazo[]>('/prazos/vencendo'),
  detalhar: (id: number) => api.get<Prazo>(`/prazos/${id}`),
  criar: (data: PrazoRequest) => api.post<Prazo>('/prazos', data),
  atualizar: (id: number, data: PrazoRequest) => api.put<Prazo>(`/prazos/${id}`, data),
  cumprir: (id: number) => api.put(`/prazos/${id}/cumprir`, {}),
  remover: (id: number) => api.delete(`/prazos/${id}`),
  listarTipos: () => api.get<TipoPrazo[]>('/tipos-prazo'),
};
