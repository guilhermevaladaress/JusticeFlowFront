import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { clientesService } from '../../services/clientes'
import { contratosService } from '../../services/contratos'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import PageHeader from '../../components/PageHeader'
import { formatDate, formatCNPJ } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function ClienteDetail() {
  const { id } = useParams()
  const toast = useToast()
  const [cliente, setCliente] = useState(null)
  const [contratos, setContratos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([clientesService.detalhar(id), contratosService.listar()])
      .then(([c, cs]) => { setCliente(c); setContratos(cs) })
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [id])

  if (carregando) return <LoadingSpinner />
  if (!cliente) return <p className="estado">Cliente não encontrado.</p>

  const contratosCliente = contratos.filter((c) => c.clienteId === cliente.id)

  return (
    <div className="section-gap">
      <PageHeader title={cliente.nomeCompleto} />

      <div className="card">
        <dl className="detalhe-grid">
          {[
            ['E-mail', cliente.email],
            ['Tipo', cliente.tipo],
            ['CPF', cliente.cpf ?? '—'],
            ['CNPJ', cliente.cnpj ? formatCNPJ(cliente.cnpj) : '—'],
            ['Razão Social', cliente.razaoSocial ?? '—'],
            ['Telefone', cliente.telefone ?? '—'],
            ['Cadastro', formatDate(cliente.dataCadastro)],
          ].map(([k, v]) => (
            <div key={k} className="detalhe-campo">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {contratosCliente.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#0f172a' }}>Contratos</h2>
          <ul className="lista-divide">
            {contratosCliente.map((c) => (
              <li key={c.id}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#0f172a' }}>{c.advogadoNome}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinado em {formatDate(c.dataAssinatura)}</p>
                </div>
                <Badge status={c.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
