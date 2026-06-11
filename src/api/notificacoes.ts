import api from './axios';
import type { Notificacao } from '../types/notificacao';

export const notificacoesApi = {
  listar: () => api.get<Notificacao[]>('/notificacoes'),
  naoLidas: () => api.get<Notificacao[]>('/notificacoes/nao-lidas'),
  marcarLida: (id: number) => api.put(`/notificacoes/${id}/ler`, {}),
  marcarTodasLidas: () => api.put('/notificacoes/ler-todas', {}),
};
