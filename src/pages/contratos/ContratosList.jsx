import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { contratosService } from '../../services/contratos'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { formatDate, formatMoney } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function ContratosList() {
  const navigate = useNavigate()
  const toast = useToast()
  const [contratos, setContratos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    contratosService.listar()
      .then(setContratos)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Contratos"
        action={
          <button onClick={() => navigate('/contratos/novo')} className="btn-primario">
            <Plus size={16} /> Novo Contrato
          </button>
        }
      />
      <div className="card card--overflow">
        {contratos.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Advogado</th>
                  <th>Cliente</th>
                  <th>Assinatura</th>
                  <th>Valor</th>
                  <th>Forma</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((c) => (
                  <tr key={c.id}>
                    <td className="negrito">{c.advogadoNome}</td>
                    <td>{c.clienteNome}</td>
                    <td className="muted">{formatDate(c.dataAssinatura)}</td>
                    <td className="negrito">{formatMoney(c.valorHonorarios)}</td>
                    <td className="muted">{c.formaPagamento}</td>
                    <td><Badge status={c.status} /></td>
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
