import { http } from "./http";

export const relatoriosService = {
  dashboard: () => http.get("/relatorios/dashboard"),
  processos: () => http.get("/relatorios/processos"),
  prazos: () => http.get("/relatorios/prazos"),
  audiencias: () => http.get("/relatorios/audiencias"),
  honorarios: () => http.get("/relatorios/honorarios"),
};
