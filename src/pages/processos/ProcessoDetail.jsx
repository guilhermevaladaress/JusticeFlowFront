import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import { processosService } from '../../services/processos'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import { formatDate } from '../../utils/formatters'
import { usePermission } from '../../hooks/usePermission'
import { useToast } from '../../context/ToastContext'

const TABS = ['Detalhes', 'Advogados', 'Clientes', 'Audiências', 'Prazos', 'Documentos', 'Movimentações']

export default function ProcessoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = usePermission()
  const toast = useToast()
  const [processo, setProcesso] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [advogados, setAdvogados] = useState(null)
  const [clientes, setClientes] = useState(null)
  const [tab, setTab] = useState(0)
  const [alterandoStatus, setAlterandoStatus] = useState(false)

  useEffect(() => {
    processosService.detalhar(id)
      .then(setProcesso)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [id])

  useEffect(() => {
    if (tab === 1 && advogados === null) {
      processosService.listarAdvogados(id).then(setAdvogados).catch(() => setAdvogados([]))
    }
    if (tab === 2 && clientes === null) {
      processosService.listarClientes(id).then(setClientes).catch(() => setClientes([]))
    }
  }, [tab])

  async function alterarStatus(status) {
    try {
      await processosService.alterarStatus(id, { status })
      setProcesso((p) => ({ ...p, status }))
      setAlterandoStatus(false)
    } catch (err) {
      toast.erro(err.message)
    }
  }

  if (carregando) return <LoadingSpinner />
  if (!processo) return <p className="estado">Processo não encontrado.</p>

  const statuses = ['Ativo', 'Suspenso', 'Encerrado', 'Arquivado']

  return (
    <div className="section-gap">
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--azul-claro)', marginBottom: 4 }}>{processo.numeroProcesso}</p>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{processo.titulo}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, fontSize: '0.875rem', color: '#64748b' }}>
              <span>{processo.tribunalNome}</span>
              {processo.varaNome && <span>· {processo.varaNome}</span>}
              <span>· Aberto em {formatDate(processo.dataAbertura)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge status={processo.status} />
            {hasRole('Administrador', 'Advogado') && (
              alterandoStatus ? (
                <select
                  defaultValue={processo.status}
                  onChange={(e) => alterarStatus(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', fontSize: '0.8rem' }}
                  autoFocus
                  onBlur={() => setAlterandoStatus(false)}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <button onClick={() => navigate(`/processos/${id}/editar`)} className="btn-icone">
                  <Pencil size={16} />
                </button>
              )
            )}
          </div>
        </div>
        {processo.descricao && <p style={{ marginTop: 12, fontSize: '0.875rem', color: '#475569' }}>{processo.descricao}</p>}
      </div>

      <div className="card card--overflow">
        <div className="tabs">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`tab-btn${tab === i ? ' ativo' : ''}`}>{t}</button>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          {tab === 0 && (
            <dl className="detalhe-grid">
              {[
                ['Tipo', processo.tipoProcessoNome],
                ['Status', processo.status],
                ['Abertura', formatDate(processo.dataAbertura)],
                ['Encerramento', processo.dataEncerramento ? formatDate(processo.dataEncerramento) : '—'],
                ['Tribunal', processo.tribunalNome],
                ['Vara', processo.varaNome ?? '—'],
              ].map(([k, v]) => (
                <div key={k} className="detalhe-campo">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === 1 && (
            advogados === null ? <LoadingSpinner size="sm" /> :
            advogados.length === 0 ? <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Nenhum advogado vinculado.</p> : (
              <ul className="lista-divide">
                {advogados.map((a) => (
                  <li key={a.advogadoId}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#0f172a' }}>{a.advogadoNome}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>OAB: {a.numeroOAB} · {a.tipoVinculo}</p>
                    </div>
                    <Badge status={a.ativo ? 'Ativo' : 'Inativo'} />
                  </li>
                ))}
              </ul>
            )
          )}
          {tab === 2 && (
            clientes === null ? <LoadingSpinner size="sm" /> :
            clientes.length === 0 ? <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Nenhum cliente vinculado.</p> : (
              <ul className="lista-divide">
                {clientes.map((c) => (
                  <li key={c.clienteId}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#0f172a' }}>{c.clienteNome}</p>
                    <Badge status={c.tipoParte} />
                  </li>
                ))}
              </ul>
            )
          )}
          {tab >= 3 && (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Use os menus de Audiências/Prazos/Documentos para filtrar por processo.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
