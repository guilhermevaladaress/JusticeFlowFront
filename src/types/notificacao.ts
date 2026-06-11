export interface Notificacao {
  id: number;
  processoId?: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  dataCriacao: string;
  dataLeitura?: string;
}
