import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { clientesService } from '../../services/clientes'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { formatDate, formatCNPJ } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function ClientesList() {
  const navigate = useNavigate()
  const toast = useToast()
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [cnpjBusca, setCnpjBusca] = useState('')
  const [cnpjResult, setCnpjResult] = useState(null)
  const [cnpjError, setCnpjError] = useState('')
  const [buscando, setBuscando] = useState(false)

  useEffect(() => {
    clientesService.listar()
      .then(setClientes)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function buscarCnpj() {
    setCnpjError('')
    setCnpjResult(null)
    setBuscando(true)
    try {
      const res = await clientesService.consultarCnpj(cnpjBusca.replace(/\D/g, ''))
      setCnpjResult(res)
    } catch {
      setCnpjError('CNPJ não encontrado ou inválido.')
    } finally {
      setBuscando(false)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div className="section-gap">
      <PageHeader title="Clientes" />

      <div className="card">
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: 10 }}>Consultar CNPJ (BrasilAPI)</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={cnpjBusca}
            onChange={(e) => setCnpjBusca(e.target.value)}
            placeholder="00.000.000/0001-00"
            className="form-input"
            style={{ maxWidth: 220 }}
          />
          <button onClick={buscarCnpj} disabled={buscando} className="btn-primario" style={{ gap: 6 }}>
            <Search size={15} /> {buscando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {cnpjError && <p className="form-erro" style={{ marginTop: 6 }}>{cnpjError}</p>}
        {cnpjResult && (
          <div className="cnpj-resultado">
            <p className="cnpj-linha"><strong>Razão Social:</strong> {cnpjResult.razaoSocial}</p>
            {cnpjResult.nomeFantasia && <p className="cnpj-linha"><strong>Nome Fantasia:</strong> {cnpjResult.nomeFantasia}</p>}
            <p className="cnpj-linha"><strong>Situação:</strong> {cnpjResult.situacaoCadastral}</p>
            {cnpjResult.municipio && <p className="cnpj-linha"><strong>Município:</strong> {cnpjResult.municipio}/{cnpjResult.uf}</p>}
          </div>
        )}
      </div>

      <div className="card card--overflow">
        {clientes.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>CPF/CNPJ</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} className="clicavel" onClick={() => navigate(`/clientes/${c.id}`)}>
                    <td className="negrito">{c.nomeCompleto}</td>
                    <td className="muted">{c.email}</td>
                    <td><Badge status={c.tipo} /></td>
                    <td className="mono">{c.cnpj ? formatCNPJ(c.cnpj) : c.cpf ?? '—'}</td>
                    <td className="muted">{formatDate(c.dataCadastro)}</td>
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
