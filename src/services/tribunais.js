import { http } from "./http";

export const tribunaisService = {
  listar: () => http.get("/tribunais"),
  detalhar: (id) => http.get(`/tribunais/${id}`),
  criar: (data) => http.post("/tribunais", data),
  atualizar: (id, data) => http.put(`/tribunais/${id}`, data),
  remover: (id) => http.del(`/tribunais/${id}`),
  importarCnj: () => http.post("/tribunais/importar-cnj", {}),
  listarVaras: (tribunalId) => http.get(`/tribunais/${tribunalId}/varas`),
  criarVara: (tribunalId, data) => http.post(`/tribunais/${tribunalId}/varas`, data),
};
