import api from './axios';
import type { Movimentacao, MovimentacaoRequest } from '../types/movimentacao';

export const movimentacoesApi = {
  listar: () => api.get<Movimentacao[]>('/movimentacoes'),
  listarPorProcesso: (processoId: number) => api.get<Movimentacao[]>(`/movimentacoes/processo/${processoId}`),
  criar: (data: MovimentacaoRequest) => api.post<Movimentacao>('/movimentacoes', data),
};
