import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { honorariosApi } from '../../api/honorarios';
import { usePermission } from '../../hooks/usePermission';
import { formatDate, formatMoney } from '../../utils/formatters';
import type { Honorario } from '../../types/honorario';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function HonorariosList() {
  const { isAdmin } = usePermission();
  const qc = useQueryClient();

  const { data: honorarios, isLoading } = useQuery({
    queryKey: ['honorarios'],
    queryFn: () => honorariosApi.listar().then((r) => r.data),
  });

  const pagarMutation = useMutation({
    mutationFn: (id: number) => honorariosApi.pagar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['honorarios'] }),
  });

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Honorários</h1><p>{honorarios?.length ?? 0} honorário(s) registrado(s)</p></div>
      </div>

      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando honorários...</div>
        ) : !honorarios || honorarios.length === 0 ? (
          <div className="estado">Nenhum honorário registrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Advogado</th><th>Cliente</th><th>Descrição</th><th>Valor</th>
                  <th>Vencimento</th><th>Pagamento</th><th>Status</th>
                  {isAdmin() && <th></th>}
                </tr>
              </thead>
              <tbody>
                {(honorarios as Honorario[]).map((h) => (
                  <tr key={h.id}>
                    <td className="negrito">{h.advogadoNome || '—'}</td>
                    <td>{h.clienteNome || '—'}</td>
                    <td className="muted truncar" style={{ maxWidth: 220 }}>{h.descricao}</td>
                    <td className="negrito">{formatMoney(h.valor)}</td>
                    <td className="muted">{formatDate(h.dataVencimento)}</td>
                    <td className="muted">{h.dataPagamento ? formatDate(h.dataPagamento) : '—'}</td>
                    <td><span className={bc(h.status)}>{h.status}</span></td>
                    {isAdmin() && (
                      <td>
                        {h.status !== 'Pago' && (
                          <button
                            className="btn-acao"
                            onClick={() => pagarMutation.mutate(h.id)}
                            style={{ color: 'var(--verde)' }}
                          >
                            Pagar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
