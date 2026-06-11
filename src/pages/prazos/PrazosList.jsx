import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, CheckCircle } from 'lucide-react'
import { prazosService } from '../../services/prazos'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { usePermission } from '../../hooks/usePermission'
import { formatDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function PrazosList() {
  const navigate = useNavigate()
  const { hasRole } = usePermission()
  const toast = useToast()
  const [tab, setTab] = useState('todos')
  const [todos, setTodos] = useState([])
  const [vencendo, setVencendo] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([prazosService.listar(), prazosService.vencendo()])
      .then(([t, v]) => { setTodos(t); setVencendo(v) })
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function cumprir(id) {
    try {
      await prazosService.cumprir(id)
      const atualizar = (list) => list.map((p) => p.id === id ? { ...p, status: 'Cumprido' } : p)
      setTodos(atualizar)
      setVencendo(atualizar)
      toast.sucesso('Prazo cumprido!')
    } catch (err) {
      toast.erro(err.message)
    }
  }

  const prazos = tab === 'todos' ? todos : vencendo

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Prazos"
        action={
          hasRole('Administrador', 'Advogado') && (
            <button onClick={() => navigate('/prazos/novo')} className="btn-primario">
              <Plus size={16} /> Novo Prazo
            </button>
          )
        }
      />
      <div className="card card--overflow">
        <div className="tabs" style={{ borderRadius: 0 }}>
          <button onClick={() => setTab('todos')} className={`tab-btn${tab === 'todos' ? ' ativo' : ''}`}>Todos</button>
          <button onClick={() => setTab('vencendo')} className={`tab-btn${tab === 'vencendo' ? ' ativo' : ''}`}>Vencendo em 7 dias</button>
        </div>
        {prazos.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Processo</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Vencimento</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  {hasRole('Administrador', 'Advogado') && <th></th>}
                </tr>
              </thead>
              <tbody>
                {prazos.map((p) => (
                  <tr key={p.id}>
                    <td className="truncar negrito" style={{ maxWidth: 130 }}>{p.processoTitulo}</td>
                    <td className="muted">{p.tipoPrazoNome}</td>
                    <td className="truncar" style={{ maxWidth: 160 }}>{p.descricao}</td>
                    <td style={{ whiteSpace: 'nowrap' }} className="muted">{formatDate(p.dataVencimento)}</td>
                    <td className="muted truncar" style={{ maxWidth: 100 }}>{p.advogadoNome ?? '—'}</td>
                    <td><Badge status={p.status} /></td>
                    {hasRole('Administrador', 'Advogado') && (
                      <td>
                        {p.status === 'Pendente' && (
                          <button onClick={() => cumprir(p.id)} className="btn-acao" style={{ color: 'var(--verde)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle size={14} /> Cumprir
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
  )
}
