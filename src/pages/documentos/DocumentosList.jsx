import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'
import { documentosService } from '../../services/documentos'
import { processosService } from '../../services/processos'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { usePermission } from '../../hooks/usePermission'
import { formatDateTime } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export default function DocumentosList() {
  const navigate = useNavigate()
  const { hasRole } = usePermission()
  const toast = useToast()
  const [documentos, setDocumentos] = useState([])
  const [processos, setProcessos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [processoFilter, setProcessoFilter] = useState('')

  useEffect(() => {
    Promise.all([documentosService.listar(), processosService.listar()])
      .then(([d, p]) => { setDocumentos(d); setProcessos(p) })
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  async function handleDownload(id, nome, mimeType) {
    try {
      const res = await documentosService.arquivo(id)
      const blob = await fetch(`data:${mimeType};base64,${res.conteudoBase64}`).then((r) => r.blob())
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.nomeArquivo || nome
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.erro(err.message)
    }
  }

  const filtered = documentos.filter((d) => !processoFilter || String(d.processoId) === processoFilter)

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Documentos"
        action={
          hasRole('Administrador', 'Advogado') && (
            <button onClick={() => navigate('/documentos/upload')} className="btn-primario">
              <Plus size={16} /> Upload
            </button>
          )
        }
      />
      <div className="card card--overflow">
        <div className="filtros">
          <select className="form-select" style={{ width: 220 }} value={processoFilter} onChange={(e) => setProcessoFilter(e.target.value)}>
            <option value="">Todos os processos</option>
            {processos.map((p) => <option key={p.id} value={String(p.id)}>{p.titulo}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <EmptyState /> : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Processo</th>
                  <th>Upload</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="negrito truncar">{d.nome}</td>
                    <td className="muted">{d.tipoDocumentoNome}</td>
                    <td className="muted truncar">{d.numeroProcesso}</td>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>{formatDateTime(d.dataUpload)}</td>
                    <td><Badge status={d.status} /></td>
                    <td>
                      <button
                        onClick={() => handleDownload(d.id, d.nome, d.mimeType)}
                        className="btn-icone"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
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
