import { http } from "./http";

export const configuracaoService = {
  obter: () => http.get("/configuracao"),
  salvar: (data) => http.put("/configuracao", data),
};
