import { useEffect, useState } from 'react'
import { honorariosService } from '../../services/honorarios'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { usePermission } from '../../hooks/usePermission'
import { formatDate, formatMoney } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function HonorariosList() {
  const { isAdmin } = usePermission()
  const toast = useToast()
  const [honorarios, setHonorarios] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    honorariosService.listar()
      .then(setHonorarios)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function pagar(id) {
    try {
      await honorariosService.pagar(id)
      setHonorarios((list) => list.map((h) => h.id === id ? { ...h, status: 'Pago' } : h))
      toast.sucesso('Honorário registrado como pago!')
    } catch (err) {
      toast.erro(err.message)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Honorários" />
      <div className="card card--overflow">
        {honorarios.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Contrato</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  {isAdmin() && <th></th>}
                </tr>
              </thead>
              <tbody>
                {honorarios.map((h) => (
                  <tr key={h.id}>
                    <td className="truncar muted" style={{ maxWidth: 120 }}>{h.clienteNome}</td>
                    <td>{h.descricao}</td>
                    <td className="negrito">{formatMoney(h.valor)}</td>
                    <td className="muted">{formatDate(h.dataVencimento)}</td>
                    <td className="muted">{h.dataPagamento ? formatDate(h.dataPagamento) : '—'}</td>
                    <td><Badge status={h.status} /></td>
                    {isAdmin() && (
                      <td>
                        {h.status !== 'Pago' && (
                          <button onClick={() => pagar(h.id)} className="btn-acao" style={{ color: 'var(--verde)' }}>
                            Pagar
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
