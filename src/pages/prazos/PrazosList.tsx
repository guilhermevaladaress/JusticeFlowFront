import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { prazosApi } from '../../api/prazos';
import { usePermission } from '../../hooks/usePermission';
import { formatDate } from '../../utils/formatters';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function PrazosList() {
  const navigate = useNavigate();
  const { hasRole } = usePermission();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'todos' | 'vencendo'>('todos');

  const { data: todos, isLoading } = useQuery({
    queryKey: ['prazos'],
    queryFn: () => prazosApi.listar().then((r) => r.data),
    enabled: tab === 'todos',
  });
  const { data: vencendo, isLoading: loadingVencendo } = useQuery({
    queryKey: ['prazos-vencendo'],
    queryFn: () => prazosApi.vencendo().then((r) => r.data),
    enabled: tab === 'vencendo',
  });

  const cumprirMutation = useMutation({
    mutationFn: (id: number) => prazosApi.cumprir(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prazos'] });
      qc.invalidateQueries({ queryKey: ['prazos-vencendo'] });
    },
  });

  const prazos = tab === 'todos' ? todos : vencendo;
  const loading = tab === 'todos' ? isLoading : loadingVencendo;

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <h1>Prazos</h1>
          <p>Controle de prazos processuais</p>
        </div>
        {hasRole('Administrador', 'Advogado') && (
          <button onClick={() => navigate('/prazos/novo')} className="btn-primario">
            <Plus size={15} strokeWidth={1.8} /> Novo Prazo
          </button>
        )}
      </div>

      <div className="card card--overflow">
        <div className="tabs">
          <button className={`tab-btn${tab === 'todos' ? ' ativo' : ''}`} onClick={() => setTab('todos')}>
            Todos
          </button>
          <button className={`tab-btn${tab === 'vencendo' ? ' ativo' : ''}`} onClick={() => setTab('vencendo')}>
            Vencendo em 7 dias
          </button>
        </div>
        {loading ? (
          <div className="estado">Carregando prazos...</div>
        ) : !prazos || prazos.length === 0 ? (
          <div className="estado">Nenhum prazo encontrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Processo</th><th>Tipo</th><th>Descrição</th>
                  <th>Vencimento</th><th>Responsável</th><th>Status</th>
                  {hasRole('Administrador', 'Advogado') && <th></th>}
                </tr>
              </thead>
              <tbody>
                {prazos.map((p) => (
                  <tr key={p.id}>
                    <td className="negrito truncar">{p.processoTitulo}</td>
                    <td className="muted">{p.tipoPrazoNome}</td>
                    <td className="truncar">{p.descricao}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(p.dataVencimento)}</td>
                    <td className="muted truncar">{p.advogadoNome ?? '—'}</td>
                    <td><span className={bc(p.status)}>{p.status}</span></td>
                    {hasRole('Administrador', 'Advogado') && (
                      <td>
                        {p.status === 'Pendente' && (
                          <button className="btn-acao" onClick={() => cumprirMutation.mutate(p.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--verde)' }}>
                            <CheckCircle size={13} strokeWidth={1.8} /> Cumprir
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
