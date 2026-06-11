import api from './axios';
import type { Audiencia, AudienciaRequest, AudienciaStatusRequest, TipoAudiencia } from '../types/audiencia';

export const audienciasApi = {
  listar: () => api.get<Audiencia[]>('/audiencias'),
  detalhar: (id: number) => api.get<Audiencia>(`/audiencias/${id}`),
  criar: (data: AudienciaRequest) => api.post<Audiencia>('/audiencias', data),
  atualizar: (id: number, data: AudienciaRequest) => api.put<Audiencia>(`/audiencias/${id}`, data),
  alterarStatus: (id: number, data: AudienciaStatusRequest) => api.put(`/audiencias/${id}/status`, data),
  remover: (id: number) => api.delete(`/audiencias/${id}`),
  listarTipos: () => api.get<TipoAudiencia[]>('/tipos-audiencia'),
};
