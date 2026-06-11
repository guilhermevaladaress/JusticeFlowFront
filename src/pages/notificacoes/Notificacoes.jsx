import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { notificacoesService } from '../../services/notificacoes'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import { formatDateTime } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function Notificacoes() {
  const navigate = useNavigate()
  const toast = useToast()
  const [notificacoes, setNotificacoes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    notificacoesService.listar()
      .then(setNotificacoes)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function marcarLida(id, processoId) {
    try {
      await notificacoesService.marcarLida(id)
      setNotificacoes((list) => list.map((n) => n.id === id ? { ...n, lida: true } : n))
      if (processoId) navigate(`/processos/${processoId}`)
    } catch (err) {
      toast.erro(err.message)
    }
  }

  async function marcarTodasLidas() {
    try {
      await notificacoesService.marcarTodasLidas()
      setNotificacoes((list) => list.map((n) => ({ ...n, lida: true })))
      toast.sucesso('Todas marcadas como lidas.')
    } catch (err) {
      toast.erro(err.message)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Notificações"
        action={
          <button onClick={marcarTodasLidas} className="btn-secundario" style={{ fontSize: '0.875rem', gap: 6 }}>
            <CheckCheck size={15} /> Marcar todas como lidas
          </button>
        }
      />
      <div className="card card--overflow">
        {notificacoes.length === 0 ? (
          <EmptyState title="Nenhuma notificação" />
        ) : (
          <ul className="notif-lista">
            {notificacoes.map((n) => (
              <li
                key={n.id}
                onClick={() => marcarLida(n.id, n.processoId)}
                className={`notif-item${!n.lida ? ' notif-item--nao-lida' : ''}`}
              >
                <div
                  className="notif-icone-wrap"
                  style={{ background: !n.lida ? '#dbeafe' : '#f1f5f9' }}
                >
                  <Bell size={16} strokeWidth={1.75} style={{ color: !n.lida ? '#1e40af' : '#94a3b8' }} />
                </div>
                <div className="notif-corpo">
                  <p className="notif-titulo">{n.titulo}</p>
                  <p className="notif-mensagem">{n.mensagem}</p>
                  <p className="notif-data">{formatDateTime(n.dataCriacao)}</p>
                </div>
                {!n.lida && <div className="notif-bolinha" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
