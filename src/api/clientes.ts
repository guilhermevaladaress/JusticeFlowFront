import api from './axios';
import type { Cliente, ClienteRequest, CnpjResponse } from '../types/cliente';

export const clientesApi = {
  listar:        ()                            => api.get<Cliente[]>('/clientes'),
  detalhar:      (id: number)                  => api.get<Cliente>(`/clientes/${id}`),
  criar:         (data: ClienteRequest)        => api.post<Cliente>('/clientes', data),
  atualizar:     (id: number, data: ClienteRequest) => api.put<Cliente>(`/clientes/${id}`, data),
  remover:       (id: number)                  => api.delete(`/clientes/${id}`),
  consultarCnpj: (cnpj: string)               => api.get<CnpjResponse>(`/clientes/cnpj/${cnpj}`),
};
