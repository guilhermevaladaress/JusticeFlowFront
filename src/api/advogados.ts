import api from './axios';
import type { Advogado, AdvogadoRequest, CreateAdvogadoRequest } from '../types/advogado';

export const advogadosApi = {
  listar:   ()                                    => api.get<Advogado[]>('/advogados'),
  detalhar: (id: number)                          => api.get<Advogado>(`/advogados/${id}`),
  criar:    (data: CreateAdvogadoRequest)         => api.post<Advogado>('/advogados', data),
  atualizar:(id: number, data: AdvogadoRequest)   => api.put<Advogado>(`/advogados/${id}`, data),
  inativar: (id: number)                          => api.delete(`/advogados/${id}`),
};
