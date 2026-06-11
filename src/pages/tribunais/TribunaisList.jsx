import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { tribunaisService } from '../../services/tribunais'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import { useToast } from '../../context/ToastContext'

export default function TribunaisList() {
  const toast = useToast()
  const [tribunais, setTribunais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [importando, setImportando] = useState(false)

  useEffect(() => {
    tribunaisService.listar()
      .then(setTribunais)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function importarCnj() {
    setImportando(true)
    try {
      await tribunaisService.importarCnj()
      const lista = await tribunaisService.listar()
      setTribunais(lista)
      toast.sucesso('Tribunais importados!')
    } catch (err) {
      toast.erro(err.message)
    } finally {
      setImportando(false)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Tribunais"
        action={
          <button onClick={importarCnj} disabled={importando} className="btn-secundario">
            <RefreshCw size={15} style={{ animation: importando ? 'spin 0.7s linear infinite' : 'none' }} />
            {importando ? 'Importando...' : 'Importar CNJ'}
          </button>
        }
      />
      <div className="card card--overflow">
        {tribunais.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Sigla</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tribunais.map((t) => (
                  <tr key={t.id}>
                    <td className="negrito">{t.sigla}</td>
                    <td>{t.nome}</td>
                    <td className="muted">{t.tipo}</td>
                    <td className="muted">{t.estado ?? '—'}</td>
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
