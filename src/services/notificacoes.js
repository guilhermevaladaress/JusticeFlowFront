import { http } from "./http";

export const notificacoesService = {
  listar: () => http.get("/notificacoes"),
  naoLidas: () => http.get("/notificacoes/nao-lidas"),
  marcarLida: (id) => http.put(`/notificacoes/${id}/ler`, {}),
  marcarTodasLidas: () => http.put("/notificacoes/ler-todas", {}),
};
