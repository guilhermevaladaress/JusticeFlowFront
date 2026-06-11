import api from './axios';
import type { Advogado, AdvogadoRequest } from '../types/advogado';

export const advogadosApi = {
  listar: () => api.get<Advogado[]>('/advogados'),
  detalhar: (id: number) => api.get<Advogado>(`/advogados/${id}`),
  atualizar: (id: number, data: AdvogadoRequest) => api.put<Advogado>(`/advogados/${id}`, data),
  inativar: (id: number) => api.delete(`/advogados/${id}`),
};
