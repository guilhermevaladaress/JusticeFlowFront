import { http } from "./http";

export const documentosService = {
  listar: () => http.get("/documentos"),
  detalhar: (id) => http.get(`/documentos/${id}`),
  arquivo: (id) => http.get(`/documentos/${id}/arquivo`),
  upload: (data) => http.post("/documentos", data),
  atualizar: (id, data) => http.put(`/documentos/${id}`, data),
  arquivar: (id) => http.del(`/documentos/${id}`),
  listarTipos: () => http.get("/tipos-documento"),
};
