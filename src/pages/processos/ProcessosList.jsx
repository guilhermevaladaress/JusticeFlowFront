import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { processosService } from '../../services/processos'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { usePermission } from '../../hooks/usePermission'
import { formatDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function ProcessosList() {
  const navigate = useNavigate()
  const { hasRole } = usePermission()
  const toast = useToast()
  const [processos, setProcessos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    processosService.listar()
      .then(setProcessos)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  const filtered = processos.filter((p) => !statusFilter || p.status === statusFilter)

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Processos"
        action={
          hasRole('Administrador', 'Advogado') && (
            <button onClick={() => navigate('/processos/novo')} className="btn-primario">
              <Plus size={16} /> Novo Processo
            </button>
          )
        }
      />
      <div className="card card--overflow">
        <div className="filtros">
          <select className="form-select" style={{ width: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos os status</option>
            {['Ativo', 'Suspenso', 'Encerrado', 'Arquivado'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Número CNJ</th>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Tribunal</th>
                  <th>Abertura</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="clicavel" onClick={() => navigate(`/processos/${p.id}`)}>
                    <td className="mono">{p.numeroProcesso}</td>
                    <td className="negrito truncar">{p.titulo}</td>
                    <td><Badge status={p.status} /></td>
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
  )
}
