import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { audienciasService } from '../../services/audiencias'
import { processosService } from '../../services/processos'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { usePermission } from '../../hooks/usePermission'
import { formatDateTime } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function AudienciasList() {
  const navigate = useNavigate()
  const { hasRole } = usePermission()
  const toast = useToast()
  const [audiencias, setAudiencias] = useState([])
  const [processos, setProcessos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [processoFilter, setProcessoFilter] = useState('')
  const [alterandoStatus, setAlterandoStatus] = useState(null)

  useEffect(() => {
    Promise.all([audienciasService.listar(), processosService.listar()])
      .then(([a, p]) => { setAudiencias(a); setProcessos(p) })
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function alterarStatus(id, status) {
    try {
      await audienciasService.alterarStatus(id, { status })
      setAudiencias((list) => list.map((a) => a.id === id ? { ...a, status } : a))
      setAlterandoStatus(null)
    } catch (err) {
      toast.erro(err.message)
    }
  }

  const filtered = audiencias.filter((a) => !processoFilter || String(a.processoId) === processoFilter)

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Audiências"
        action={
          hasRole('Administrador', 'Advogado') && (
            <button onClick={() => navigate('/audiencias/nova')} className="btn-primario">
              <Plus size={16} /> Nova Audiência
            </button>
          )
        }
      />
      <div className="card card--overflow">
        <div className="filtros">
          <select className="form-select" style={{ width: 220 }} value={processoFilter} onChange={(e) => setProcessoFilter(e.target.value)}>
            <option value="">Todos os processos</option>
            {processos.map((p) => <option key={p.id} value={String(p.id)}>{p.titulo}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Processo</th>
                  <th>Tipo</th>
                  <th>Data/Hora</th>
                  <th>Local</th>
                  <th>Status</th>
                  {hasRole('Administrador', 'Advogado') && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="truncar negrito">{a.processoTitulo}</td>
                    <td className="muted">{a.tipoAudienciaNome}</td>
                    <td style={{ whiteSpace: 'nowrap' }} className="muted">{formatDateTime(a.dataHora)}</td>
                    <td className="muted truncar" style={{ fontSize: '0.8rem' }}>{a.local ?? a.linkVirtual ?? '—'}</td>
                    <td>
                      {alterandoStatus === a.id ? (
                        <select
                          defaultValue={a.status}
                          onChange={(e) => alterarStatus(a.id, e.target.value)}
                          onBlur={() => setAlterandoStatus(null)}
                          className="form-select"
                          style={{ width: 'auto', fontSize: '0.8rem' }}
                          autoFocus
                        >
                          {['Agendada', 'Realizada', 'Cancelada', 'Adiada'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <Badge status={a.status} />
                      )}
                    </td>
                    {hasRole('Administrador', 'Advogado') && (
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => navigate(`/audiencias/${a.id}/editar`)} className="btn-acao">Editar</button>
                          <button onClick={() => setAlterandoStatus(a.id)} className="btn-acao" style={{ color: '#64748b' }}>Status</button>
                        </div>
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
  )
}
