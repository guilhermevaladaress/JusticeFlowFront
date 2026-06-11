import { http } from "./http";

export const prazosService = {
  listar: () => http.get("/prazos"),
  vencendo: () => http.get("/prazos/vencendo"),
  detalhar: (id) => http.get(`/prazos/${id}`),
  criar: (data) => http.post("/prazos", data),
  atualizar: (id, data) => http.put(`/prazos/${id}`, data),
  cumprir: (id) => http.put(`/prazos/${id}/cumprir`, {}),
  remover: (id) => http.del(`/prazos/${id}`),
  listarTipos: () => http.get("/tipos-prazo"),
};
