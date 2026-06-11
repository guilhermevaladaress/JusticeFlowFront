import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { contratosApi } from '../../api/contratos';
import { formatDate, formatMoney } from '../../utils/formatters';
import type { Contrato } from '../../types/contrato';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function ContratosList() {
  const navigate = useNavigate();

  const { data: contratos, isLoading } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => contratosApi.listar().then((r) => r.data),
  });

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Contratos</h1><p>{contratos?.length ?? 0} contrato(s) cadastrado(s)</p></div>
        <button onClick={() => navigate('/contratos/novo')} className="btn-primario">
          <Plus size={15} strokeWidth={1.8} /> Novo Contrato
        </button>
      </div>

      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando contratos...</div>
        ) : !contratos || contratos.length === 0 ? (
          <div className="estado">Nenhum contrato cadastrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Advogado</th><th>Cliente</th><th>Assinatura</th>
                  <th>Validade</th><th>Valor</th><th>Forma</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(contratos as Contrato[]).map((c) => (
                  <tr key={c.id}>
                    <td className="negrito">{c.advogadoNome || '—'}</td>
                    <td>{c.clienteNome || '—'}</td>
                    <td className="muted">{formatDate(c.dataAssinatura)}</td>
                    <td className="muted">{c.dataValidade ? formatDate(c.dataValidade) : '—'}</td>
                    <td className="negrito">{formatMoney(c.valorHonorarios)}</td>
                    <td className="muted">{c.formaPagamento}</td>
                    <td><span className={bc(c.status)}>{c.status}</span></td>
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
