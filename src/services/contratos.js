import { http } from "./http";

export const contratosService = {
  listar: () => http.get("/contratos"),
  detalhar: (id) => http.get(`/contratos/${id}`),
  criar: (data) => http.post("/contratos", data),
  atualizar: (id, data) => http.put(`/contratos/${id}`, data),
  cancelar: (id) => http.del(`/contratos/${id}`),
};
