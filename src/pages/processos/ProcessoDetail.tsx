import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { processosApi } from '../../api/processos';
import { movimentacoesApi } from '../../api/movimentacoes';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { usePermission } from '../../hooks/usePermission';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

const TABS = ['Detalhes', 'Advogados', 'Clientes', 'Audiências', 'Prazos', 'Documentos', 'Movimentações'];

export function ProcessoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { hasRole } = usePermission();
  const [tab, setTab] = useState(0);
  const [changingStatus, setChangingStatus] = useState(false);

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo', id],
    queryFn: () => processosApi.detalhar(Number(id)).then((r) => r.data),
  });

  const { data: advogados } = useQuery({
    queryKey: ['processo-advogados', id],
    queryFn: () => processosApi.listarAdvogados(Number(id)).then((r) => r.data),
    enabled: tab === 1,
  });

  const { data: clientes } = useQuery({
    queryKey: ['processo-clientes', id],
    queryFn: () => processosApi.listarClientes(Number(id)).then((r) => r.data),
    enabled: tab === 2,
  });

  const { data: movimentacoes } = useQuery({
    queryKey: ['movimentacoes-processo', id],
    queryFn: () => movimentacoesApi.listarPorProcesso(Number(id)).then((r) => r.data),
    enabled: tab === 6,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => processosApi.alterarStatus(Number(id), { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['processo', id] }); setChangingStatus(false); },
  });

  if (isLoading) return <div className="estado" style={{ paddingTop: 80 }}>Carregando...</div>;
  if (!processo) return <div className="estado">Processo não encontrado.</div>;

  return (
    <div className="section-gap">
      {/* Header do processo */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p className="mono" style={{ marginBottom: 4 }}>{processo.numeroProcesso}</p>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{processo.titulo}</h1>
            <p style={{ marginTop: 6, fontSize: '0.875rem', color: '#64748b' }}>
              {processo.tribunalNome}{processo.varaNome ? ` · ${processo.varaNome}` : ''} · Aberto em {formatDate(processo.dataAbertura)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={bc(processo.status)}>{processo.status}</span>
            {hasRole('Administrador', 'Advogado') && (
              changingStatus ? (
                <select defaultValue={processo.status} autoFocus onBlur={() => setChangingStatus(false)}
                  onChange={(e) => statusMutation.mutate(e.target.value)}
                  className="form-select" style={{ width: 'auto', fontSize: '0.82rem', padding: '5px 10px' }}>
                  {['Ativo', 'Suspenso', 'Encerrado', 'Arquivado'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <button className="btn-icone" onClick={() => navigate(`/processos/${id}/editar`)} title="Editar">
                  <Pencil size={15} strokeWidth={1.8} />
                </button>
              )
            )}
          </div>
        </div>
        {processo.descricao && (
          <p style={{ marginTop: 12, fontSize: '0.875rem', color: '#64748b' }}>{processo.descricao}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="card card--overflow">
        <div className="tabs">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`tab-btn${tab === i ? ' ativo' : ''}`}>{t}</button>
          ))}
        </div>
        <div style={{ padding: '20px 22px' }}>
          {tab === 0 && (
            <dl className="detalhe-grid">
              {([
                ['Tipo', processo.tipoProcessoNome],
                ['Status', processo.status],
                ['Abertura', formatDate(processo.dataAbertura)],
                ['Encerramento', processo.dataEncerramento ? formatDate(processo.dataEncerramento) : '—'],
                ['Tribunal', processo.tribunalNome],
                ['Vara', processo.varaNome ?? '—'],
                ['Advogados', processo.advogados?.join(', ') ?? '—'],
                ['Clientes', processo.clientes?.join(', ') ?? '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="detalhe-campo">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === 1 && (
            !advogados ? <div className="estado">Carregando...</div> :
            advogados.length === 0 ? <div className="estado">Nenhum advogado vinculado.</div> : (
              <ul className="lista-divide">
                {advogados.map((a) => (
                  <li key={a.advogadoId}>
                    <div>
                      <p style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.875rem' }}>{a.advogadoNome}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>OAB: {a.numeroOAB} · {a.tipoVinculo}</p>
                    </div>
                    <span className={bc(a.ativo ? 'Ativo' : 'Inativo')}>{a.ativo ? 'Ativo' : 'Inativo'}</span>
                  </li>
                ))}
              </ul>
            )
          )}
          {tab === 2 && (
            !clientes ? <div className="estado">Carregando...</div> :
            clientes.length === 0 ? <div className="estado">Nenhum cliente vinculado.</div> : (
              <ul className="lista-divide">
                {clientes.map((c) => (
                  <li key={c.clienteId}>
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.875rem' }}>{c.clienteNome}</span>
                    <span className={bc(c.tipoParte)}>{c.tipoParte}</span>
                  </li>
                ))}
              </ul>
            )
          )}
          {tab >= 3 && tab < 6 && (
            <div className="estado">Use os menus de Audiências / Prazos / Documentos para filtrar por processo.</div>
          )}
          {tab === 6 && (
            !movimentacoes ? <div className="estado">Carregando...</div> :
            movimentacoes.length === 0 ? <div className="estado">Nenhuma movimentação registrada.</div> : (
              <ul className="lista-divide" style={{ padding: 0 }}>
                {movimentacoes.map((m) => (
                  <li key={m.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={'badge badge--' + m.tipo.toLowerCase()}>{m.tipo}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {formatDateTime(m.dataHora)} · {m.usuario}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>{m.descricao}</p>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
}
