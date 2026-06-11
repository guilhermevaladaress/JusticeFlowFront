import api from './axios';
import type { Honorario, HonorarioRequest } from '../types/honorario';

export const honorariosApi = {
  listar: () => api.get<Honorario[]>('/honorarios'),
  detalhar: (id: number) => api.get<Honorario>(`/honorarios/${id}`),
  criar: (data: HonorarioRequest) => api.post<Honorario>('/honorarios', data),
  atualizar: (id: number, data: HonorarioRequest) => api.put<Honorario>(`/honorarios/${id}`, data),
  pagar: (id: number) => api.put(`/honorarios/${id}/pagar`, {}),
  remover: (id: number) => api.delete(`/honorarios/${id}`),
};
