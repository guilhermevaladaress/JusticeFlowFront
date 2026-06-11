import { useEffect, useState } from 'react'
import { Scale, Calendar, Clock, FileText, Users } from 'lucide-react'
import { relatoriosService } from '../../services/relatorios'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import { formatDate, formatDateTime } from '../../utils/formatters'
import { usePermission } from '../../hooks/usePermission'
import { useToast } from '../../context/ToastContext'

export default function Dashboard() {
  const { isCliente } = usePermission()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    relatoriosService.dashboard()
      .then(setData)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <LoadingSpinner />
  if (!data) return null

  const cards = [
    { label: 'Processos Ativos', value: data.processosAtivos,   icone: Scale,     cor: '#1B3A6B' },
    { label: 'Audiências Hoje',  value: data.audienciasHoje,     icone: Calendar,  cor: '#7c3aed' },
    { label: 'Prazos Vencendo',  value: data.prazosVencendo,     icone: Clock,     cor: '#e65100' },
    { label: 'Documentos',       value: data.totalDocumentos,    icone: FileText,  cor: '#0f766e' },
    ...(!isCliente() ? [{ label: 'Clientes', value: data.totalClientes, icone: Users, cor: '#0369a1' }] : []),
  ]

  return (
    <div className="section-gap">
      <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#0f172a' }}>Dashboard</h1>

      <div className="kpi-grid">
        {cards.map(({ label, value, icone: Icone, cor }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-icone" style={{ background: cor }}>
              <Icone size={20} strokeWidth={1.75} />
            </div>
            <div>
              <p className="kpi-valor">{value}</p>
              <p className="kpi-rotulo">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14, color: '#0f172a' }}>
            Prazos Vencendo (7 dias)
          </h2>
          {data.prazosProximos.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Nenhum prazo próximo.</p>
          ) : (
            <ul className="lista-divide">
              {data.prazosProximos.map((p) => (
                <li key={p.id}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 500, color: '#1e293b', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descricao}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.processoTitulo}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDate(p.dataVencimento)}</span>
                    <Badge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14, color: '#0f172a' }}>
            Próximas Audiências
          </h2>
          {data.audienciasProximas.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Nenhuma audiência próxima.</p>
          ) : (
            <ul className="lista-divide">
              {data.audienciasProximas.map((a) => (
                <li key={a.id}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 500, color: '#1e293b', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.processoTitulo}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.tipoAudienciaNome}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDateTime(a.dataHora)}</span>
                    <Badge status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
