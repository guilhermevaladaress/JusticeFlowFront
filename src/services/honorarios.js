import { http } from "./http";

export const honorariosService = {
  listar: () => http.get("/honorarios"),
  detalhar: (id) => http.get(`/honorarios/${id}`),
  criar: (data) => http.post("/honorarios", data),
  atualizar: (id, data) => http.put(`/honorarios/${id}`, data),
  pagar: (id) => http.put(`/honorarios/${id}/pagar`, {}),
  remover: (id) => http.del(`/honorarios/${id}`),
};
