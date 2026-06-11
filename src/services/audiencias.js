import { http } from "./http";

export const audienciasService = {
  listar: () => http.get("/audiencias"),
  detalhar: (id) => http.get(`/audiencias/${id}`),
  criar: (data) => http.post("/audiencias", data),
  atualizar: (id, data) => http.put(`/audiencias/${id}`, data),
  alterarStatus: (id, data) => http.put(`/audiencias/${id}/status`, data),
  remover: (id) => http.del(`/audiencias/${id}`),
  listarTipos: () => http.get("/tipos-audiencia"),
};
