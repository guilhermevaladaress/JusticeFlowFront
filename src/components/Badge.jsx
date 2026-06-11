const CLASSES = {
  Ativo:          "badge badge--ativo",
  Cumprido:       "badge badge--cumprido",
  Realizada:      "badge badge--realizada",
  Pago:           "badge badge--pago",
  Suspenso:       "badge badge--suspenso",
  Pendente:       "badge badge--pendente",
  Agendada:       "badge badge--agendada",
  Encerrado:      "badge badge--encerrado",
  Arquivado:      "badge badge--arquivado",
  Inativo:        "badge badge--inativo",
  Vencido:        "badge badge--vencido",
  Cancelada:      "badge badge--cancelada",
  Atrasado:       "badge badge--atrasado",
  Adiada:         "badge badge--adiada",
  PessoaFisica:   "badge badge--pessoacfisica",
  PessoaJuridica: "badge badge--pessoacjuridica",
};

export default function Badge({ status, className = "" }) {
  const cls = CLASSES[status] ?? "badge";
  return <span className={`${cls} ${className}`.trim()}>{status}</span>;
}
