export interface Cliente {
  id: number;
  usuarioId: string;
  nomeCompleto: string;
  email: string;
  tipo: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cpf?: string;
  telefone?: string;
  dataCadastro: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface ClienteRequest {
  nomeCompleto?: string;
  email?: string;
  tipo: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cpf?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface CnpjResponse {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacaoCadastral: string;
  logradouro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
}
