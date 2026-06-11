import api from './axios';
import type { Contrato, ContratoRequest } from '../types/contrato';

export const contratosApi = {
  listar: () => api.get<Contrato[]>('/contratos'),
  detalhar: (id: number) => api.get<Contrato>(`/contratos/${id}`),
  criar: (data: ContratoRequest) => api.post<Contrato>('/contratos', data),
  atualizar: (id: number, data: ContratoRequest) => api.put<Contrato>(`/contratos/${id}`, data),
  cancelar: (id: number) => api.delete(`/contratos/${id}`),
};
