import { useEffect, useState } from 'react'
import { advogadosService } from '../../services/advogados'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { formatOAB } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'

export default function AdvogadosList() {
  const toast = useToast()
  const confirmar = useConfirm()
  const [advogados, setAdvogados] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    advogadosService.listar()
      .then(setAdvogados)
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function handleInativar(id) {
    const ok = await confirmar({
      titulo: 'Inativar Advogado',
      mensagem: 'Tem certeza? O advogado não poderá ser vinculado a novos processos.',
      confirmar: 'Inativar',
      tipo: 'perigo',
    })
    if (!ok) return
    try {
      await advogadosService.inativar(id)
      setAdvogados((list) => list.map((a) => a.id === id ? { ...a, status: 'Inativo' } : a))
      toast.sucesso('Advogado inativado.')
    } catch (err) {
      toast.erro(err.message)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Advogados" />
      <div className="card card--overflow">
        {advogados.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>OAB</th>
                  <th>Especialidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {advogados.map((a) => (
                  <tr key={a.id}>
                    <td className="negrito">{a.nomeCompleto}</td>
                    <td className="mono">{formatOAB(a.numeroOAB, a.uf)}</td>
                    <td className="muted">{a.especialidade ?? '—'}</td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      {a.status === 'Ativo' && (
                        <button onClick={() => handleInativar(a.id)} className="btn-acao btn-acao--perigo">
                          Inativar
                        </button>
                      )}
                    </td>
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
