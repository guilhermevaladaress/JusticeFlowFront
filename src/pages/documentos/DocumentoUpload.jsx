import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { documentosService } from '../../services/documentos'
import { processosService } from '../../services/processos'
import PageHeader from '../../components/PageHeader'
import { useToast } from '../../context/ToastContext'

export default function DocumentoUpload() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileRef = useRef(null)
  const [salvando, setSalvando] = useState(false)
  const [processos, setProcessos] = useState([])
  const [tipos, setTipos] = useState([])
  const [fileInfo, setFileInfo] = useState(null)
  const [form, setForm] = useState({ processoId: '', tipoDocumentoId: '', nome: '', descricao: '' })
  const [erros, setErros] = useState({})

  useEffect(() => {
    Promise.all([processosService.listar(), documentosService.listarTipos()])
      .then(([p, t]) => { setProcessos(p); setTipos(t) })
      .catch(() => {})
  }, [])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      setFileInfo({ name: file.name, base64, mimeType: file.type })
    }
    reader.readAsDataURL(file)
  }

  function validar() {
    const e = {}
    if (!form.processoId) e.processoId = 'Selecione o processo'
    if (!form.tipoDocumentoId) e.tipoDocumentoId = 'Selecione o tipo'
    if (!form.nome) e.nome = 'Obrigatório'
    if (!fileInfo) e.arquivo = 'Selecione um arquivo'
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      await documentosService.upload({
        ...form,
        processoId: Number(form.processoId),
        tipoDocumentoId: Number(form.tipoDocumentoId),
        nomeArquivo: fileInfo.name,
        conteudoBase64: fileInfo.base64,
        mimeType: fileInfo.mimeType,
      })
      toast.sucesso('Documento enviado!')
      navigate('/documentos')
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao enviar.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <PageHeader title="Upload de Documento" />
      <div className="form-wrap">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-campo">
            <label>Processo</label>
            <select className="form-select" value={form.processoId} onChange={(e) => set('processoId', e.target.value)}>
              <option value="">Selecione</option>
              {processos.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
            </select>
            {erros.processoId && <p className="form-erro">{erros.processoId}</p>}
          </div>
          <div className="form-campo">
            <label>Tipo de Documento</label>
            <select className="form-select" value={form.tipoDocumentoId} onChange={(e) => set('tipoDocumentoId', e.target.value)}>
              <option value="">Selecione</option>
              {tipos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {erros.tipoDocumentoId && <p className="form-erro">{erros.tipoDocumentoId}</p>}
          </div>
          <div className="form-campo">
            <label>Nome do Documento</label>
            <input className="form-input" value={form.nome} onChange={(e) => set('nome', e.target.value)} />
            {erros.nome && <p className="form-erro">{erros.nome}</p>}
          </div>
          <div className="form-campo">
            <label>Descrição</label>
            <input className="form-input" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} />
          </div>
          <div className="form-campo">
            <label>Arquivo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`upload-zona${fileInfo ? ' upload-zona--selecionado' : ''}`}
            >
              <Upload size={32} strokeWidth={1.5} style={{ color: '#94a3b8', margin: '0 auto 8px' }} />
              {fileInfo ? (
                <p style={{ color: 'var(--verde)', fontWeight: 500 }}>{fileInfo.name}</p>
              ) : (
                <p>Clique para selecionar um arquivo</p>
              )}
            </div>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} />
            {erros.arquivo && <p className="form-erro">{erros.arquivo}</p>}
          </div>
          <div className="form-acoes">
            <button type="button" onClick={() => navigate(-1)} className="btn-secundario">Cancelar</button>
            <button type="submit" disabled={salvando || !fileInfo} className="btn-primario">
              {salvando ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
