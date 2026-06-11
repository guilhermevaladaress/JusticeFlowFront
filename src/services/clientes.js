import { http } from "./http";

export const clientesService = {
  listar: () => http.get("/clientes"),
  detalhar: (id) => http.get(`/clientes/${id}`),
  atualizar: (id, data) => http.put(`/clientes/${id}`, data),
  remover: (id) => http.del(`/clientes/${id}`),
  consultarCnpj: (cnpj) => http.get(`/clientes/cnpj/${cnpj}`),
};
