import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { processosApi } from '../../api/processos';
import { usePermission } from '../../hooks/usePermission';
import { formatDate } from '../../utils/formatters';
import { useState } from 'react';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function ProcessosList() {
  const navigate = useNavigate();
  const { hasRole } = usePermission();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: processos, isLoading } = useQuery({
    queryKey: ['processos'],
    queryFn: () => processosApi.listar().then((r) => r.data),
  });

  const filtered = processos?.filter((p) => !statusFilter || p.status === statusFilter) ?? [];

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <h1>Processos</h1>
          <p>{processos?.length ?? 0} processo(s) no sistema</p>
        </div>
        {hasRole('Administrador', 'Advogado') && (
          <button onClick={() => navigate('/processos/novo')} className="btn-primario">
            <Plus size={15} strokeWidth={1.8} /> Novo Processo
          </button>
        )}
      </div>

      <div className="card card--overflow">
        <div className="filtros">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select" style={{ width: 'auto' }}>
            <option value="">Todos os status</option>
            {['Ativo', 'Suspenso', 'Encerrado', 'Arquivado'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="estado">Carregando processos...</div>
        ) : filtered.length === 0 ? (
          <div className="estado">Nenhum processo encontrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Número CNJ</th><th>Título</th><th>Status</th>
                  <th>Tribunal</th><th>Abertura</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="clicavel" onClick={() => navigate(`/processos/${p.id}`)}>
                    <td className="mono">{p.numeroProcesso}</td>
                    <td className="negrito truncar">{p.titulo}</td>
                    <td><span className={bc(p.status)}>{p.status}</span></td>
                    <td className="muted">{p.tribunalNome}</td>
                    <td className="muted">{formatDate(p.dataAbertura)}</td>
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
