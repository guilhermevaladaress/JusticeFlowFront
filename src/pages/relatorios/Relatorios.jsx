import { useEffect, useState } from 'react'
import { relatoriosService } from '../../services/relatorios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { formatMoney } from '../../utils/formatters'
import PageHeader from '../../components/PageHeader'
import { usePermission } from '../../hooks/usePermission'
import { useToast } from '../../context/ToastContext'

export default function Relatorios() {
  const { isAdmin } = usePermission()
  const toast = useToast()
  const [prazos, setPrazos] = useState(null)
  const [audiencias, setAudiencias] = useState(null)
  const [processos, setProcessos] = useState(null)
  const [honorarios, setHonorarios] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const promessas = [
      relatoriosService.prazos().then(setPrazos),
      relatoriosService.audiencias().then(setAudiencias),
    ]
    if (isAdmin()) {
      promessas.push(relatoriosService.processos().then(setProcessos))
      promessas.push(relatoriosService.honorarios().then(setHonorarios))
    }
    Promise.all(promessas)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <LoadingSpinner />

  return (
    <div className="section-gap">
      <PageHeader title="Relatórios" />

      {audiencias && (
        <div className="kpi-grid">
          {[
            { label: 'Audiências Agendadas', value: audiencias.agendadas,  cor: '#1e40af' },
            { label: 'Audiências Realizadas', value: audiencias.realizadas, cor: 'var(--verde)' },
            { label: 'Audiências Canceladas', value: audiencias.canceladas, cor: 'var(--vermelho)' },
            { label: 'Audiências Adiadas',   value: audiencias.adiadas,    cor: 'var(--laranja)' },
          ].map(({ label, value, cor }) => (
            <div key={label} className="card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: cor, marginTop: 4 }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {prazos && (
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14, color: '#0f172a' }}>Prazos por Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
            {prazos.porStatus.map(({ status, quantidade }) => (
              <div key={status} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>{quantidade}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdmin() && processos && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          <div className="card">
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14, color: '#0f172a' }}>Processos por Status</h2>
            <ul className="lista-divide">
              {processos.porStatus.map(({ status, quantidade }) => (
                <li key={status}>
                  <span style={{ color: '#374151' }}>{status}</span>
                  <strong style={{ color: '#0f172a' }}>{quantidade}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14, color: '#0f172a' }}>Processos por Tipo</h2>
            <ul className="lista-divide">
              {processos.porTipo.map(({ tipo, quantidade }) => (
                <li key={tipo}>
                  <span style={{ color: '#374151' }}>{tipo}</span>
                  <strong style={{ color: '#0f172a' }}>{quantidade}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isAdmin() && honorarios && (
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14, color: '#0f172a' }}>Honorários</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
            {[
              { label: 'Total Pago',   value: honorarios.totalPago,      cor: 'var(--verde)' },
              { label: 'Pendente',     value: honorarios.totalPendente,   cor: '#92640a' },
              { label: 'Atrasado',     value: honorarios.totalAtrasado,   cor: 'var(--vermelho)' },
            ].map(({ label, value, cor }) => (
              <div key={label}>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: cor }}>{formatMoney(value)}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
