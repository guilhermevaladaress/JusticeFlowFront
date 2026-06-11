import api from './axios';
import type {
  Processo, ProcessoRequest, ProcessoStatusRequest,
  VincularAdvogadoRequest, VincularClienteRequest,
  ProcessoAdvogado, ProcessoCliente
} from '../types/processo';

export const processosApi = {
  listar: () => api.get<Processo[]>('/processos'),
  detalhar: (id: number) => api.get<Processo>(`/processos/${id}`),
  criar: (data: ProcessoRequest) => api.post<Processo>('/processos', data),
  atualizar: (id: number, data: ProcessoRequest) => api.put<Processo>(`/processos/${id}`, data),
  alterarStatus: (id: number, data: ProcessoStatusRequest) => api.put(`/processos/${id}/status`, data),
  arquivar: (id: number) => api.delete(`/processos/${id}`),
  listarAdvogados: (id: number) => api.get<ProcessoAdvogado[]>(`/processos/${id}/advogados`),
  vincularAdvogado: (id: number, data: VincularAdvogadoRequest) => api.post(`/processos/${id}/advogados`, data),
  desvincularAdvogado: (id: number, advId: number) => api.delete(`/processos/${id}/advogados/${advId}`),
  listarClientes: (id: number) => api.get<ProcessoCliente[]>(`/processos/${id}/clientes`),
  vincularCliente: (id: number, data: VincularClienteRequest) => api.post(`/processos/${id}/clientes`, data),
  desvincularCliente: (id: number, cliId: number) => api.delete(`/processos/${id}/clientes/${cliId}`),
  listarTipos: () => api.get('/tipos-processo'),
};
