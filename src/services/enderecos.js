import { http } from "./http";

export const enderecosService = {
  listar: () => http.get("/enderecos"),
  criar: (data) => http.post("/enderecos", data),
  atualizar: (id, data) => http.put(`/enderecos/${id}`, data),
  remover: (id) => http.del(`/enderecos/${id}`),
  consultarCep: (cep) => http.get(`/enderecos/cep/${cep}`),
};
