import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { audienciasApi } from '../../api/audiencias';
import { processosApi } from '../../api/processos';
import { usePermission } from '../../hooks/usePermission';
import { formatDateTime } from '../../utils/formatters';
import { useState } from 'react';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function AudienciasList() {
  const navigate = useNavigate();
  const { hasRole } = usePermission();
  const qc = useQueryClient();
  const [processoFilter, setProcessoFilter] = useState('');
  const [changingStatus, setChangingStatus] = useState<number | null>(null);

  const { data: audiencias, isLoading } = useQuery({
    queryKey: ['audiencias'],
    queryFn: () => audienciasApi.listar().then((r) => r.data),
  });
  const { data: processos } = useQuery({
    queryKey: ['processos'],
    queryFn: () => processosApi.listar().then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      audienciasApi.alterarStatus(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['audiencias'] }); setChangingStatus(null); },
  });

  const filtered = audiencias?.filter(
    (a) => !processoFilter || String(a.processoId) === processoFilter
  ) ?? [];

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <h1>Audiências</h1>
          <p>{audiencias?.length ?? 0} audiência(s) cadastrada(s)</p>
        </div>
        {hasRole('Administrador', 'Advogado') && (
          <button onClick={() => navigate('/audiencias/nova')} className="btn-primario">
            <Plus size={15} strokeWidth={1.8} /> Nova Audiência
          </button>
        )}
      </div>

      <div className="card card--overflow">
        <div className="filtros">
          <select value={processoFilter} onChange={(e) => setProcessoFilter(e.target.value)}
            className="form-select" style={{ width: 'auto' }}>
            <option value="">Todos os processos</option>
            {processos?.map((p) => (
              <option key={p.id} value={String(p.id)}>{p.titulo}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="estado">Carregando audiências...</div>
        ) : filtered.length === 0 ? (
          <div className="estado">Nenhuma audiência encontrada.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Processo</th><th>Tipo</th><th>Data/Hora</th>
                  <th>Local</th><th>Status</th>
                  {hasRole('Administrador', 'Advogado') && <th></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="negrito truncar">{a.processoTitulo}</td>
                    <td className="muted">{a.tipoAudienciaNome}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(a.dataHora)}</td>
                    <td className="muted truncar">{a.local ?? a.linkVirtual ?? '—'}</td>
                    <td>
                      {changingStatus === a.id ? (
                        <select defaultValue={a.status} autoFocus
                          onChange={(e) => statusMutation.mutate({ id: a.id, status: e.target.value })}
                          onBlur={() => setChangingStatus(null)}
                          className="form-select"
                          style={{ fontSize: '0.78rem', padding: '4px 8px', width: 'auto' }}>
                          {['Agendada', 'Realizada', 'Cancelada', 'Adiada'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={bc(a.status)}>{a.status}</span>
                      )}
                    </td>
                    {hasRole('Administrador', 'Advogado') && (
                      <td>
                        <span style={{ display: 'flex', gap: 10 }}>
                          <button className="btn-acao" onClick={() => navigate(`/audiencias/${a.id}/editar`)}>Editar</button>
                          <button className="btn-acao" onClick={() => setChangingStatus(a.id)}>Status</button>
                        </span>
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
