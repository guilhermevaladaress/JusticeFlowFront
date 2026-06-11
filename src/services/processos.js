import { http } from "./http";

export const processosService = {
  listar: () => http.get("/processos"),
  detalhar: (id) => http.get(`/processos/${id}`),
  criar: (data) => http.post("/processos", data),
  atualizar: (id, data) => http.put(`/processos/${id}`, data),
  alterarStatus: (id, data) => http.put(`/processos/${id}/status`, data),
  arquivar: (id) => http.del(`/processos/${id}`),
  listarAdvogados: (id) => http.get(`/processos/${id}/advogados`),
  vincularAdvogado: (id, data) => http.post(`/processos/${id}/advogados`, data),
  desvincularAdvogado: (id, advId) => http.del(`/processos/${id}/advogados/${advId}`),
  listarClientes: (id) => http.get(`/processos/${id}/clientes`),
  vincularCliente: (id, data) => http.post(`/processos/${id}/clientes`, data),
  desvincularCliente: (id, cliId) => http.del(`/processos/${id}/clientes/${cliId}`),
  listarTipos: () => http.get("/tipos-processo"),
};
