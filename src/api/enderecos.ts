import api from './axios';

export interface Endereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
}

export interface EnderecoRequest {
  cep: string;
  numero: string;
  complemento?: string;
  principal?: boolean;
}

export const enderecosApi = {
  listar: () => api.get<Endereco[]>('/enderecos'),
  criar: (data: EnderecoRequest) => api.post<Endereco>('/enderecos', data),
  atualizar: (id: number, data: Partial<EnderecoRequest>) => api.put<Endereco>(`/enderecos/${id}`, data),
  remover: (id: number) => api.delete(`/enderecos/${id}`),
  consultarCep: (cep: string) => api.get(`/enderecos/cep/${cep}`),
};
