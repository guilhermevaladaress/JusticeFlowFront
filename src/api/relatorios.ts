import api from './axios';
import type {
  DashboardData, RelatorioProcessos, RelatorioPrazos,
  RelatorioAudiencias, RelatorioHonorarios
} from '../types/relatorio';

export const relatoriosApi = {
  dashboard: () => api.get<DashboardData>('/relatorios/dashboard'),
  processos: () => api.get<RelatorioProcessos>('/relatorios/processos'),
  prazos: () => api.get<RelatorioPrazos>('/relatorios/prazos'),
  audiencias: () => api.get<RelatorioAudiencias>('/relatorios/audiencias'),
  honorarios: () => api.get<RelatorioHonorarios>('/relatorios/honorarios'),
};
