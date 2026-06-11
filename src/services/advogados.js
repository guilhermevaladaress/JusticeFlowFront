import { http } from "./http";

export const advogadosService = {
  listar: () => http.get("/advogados"),
  detalhar: (id) => http.get(`/advogados/${id}`),
  atualizar: (id, data) => http.put(`/advogados/${id}`, data),
  inativar: (id) => http.del(`/advogados/${id}`),
};
