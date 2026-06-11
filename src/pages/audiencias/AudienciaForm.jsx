import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { audienciasService } from '../../services/audiencias'
import { processosService } from '../../services/processos'
import PageHeader from '../../components/PageHeader'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../context/ToastContext'

export default function AudienciaForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const toast = useToast()
  const [carregando, setCarregando] = useState(isEdit)
  const [salvando, setSalvando] = useState(false)
  const [processos, setProcessos] = useState([])
  const [tipos, setTipos] = useState([])
  const [form, setForm] = useState({ processoId: '', tipoAudienciaId: '', dataHora: '', local: '', linkVirtual: '', observacoes: '' })
  const [erros, setErros] = useState({})

  useEffect(() => {
    Promise.all([processosService.listar(), audienciasService.listarTipos()])
      .then(([p, t]) => { setProcessos(p); setTipos(t) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    audienciasService.detalhar(id)
      .then((a) => setForm({
        processoId: a.processoId,
        tipoAudienciaId: a.tipoAudienciaId,
        dataHora: a.dataHora?.slice(0, 16) ?? '',
        local: a.local ?? '',
        linkVirtual: a.linkVirtual ?? '',
        observacoes: a.observacoes ?? '',
      }))
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [id])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.processoId) e.processoId = 'Selecione o processo'
    if (!form.tipoAudienciaId) e.tipoAudienciaId = 'Selecione o tipo'
    if (!form.dataHora) e.dataHora = 'Obrigatório'
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      const dados = {
        ...form,
        processoId: Number(form.processoId),
        tipoAudienciaId: Number(form.tipoAudienciaId),
      }
      if (isEdit) {
        await audienciasService.atualizar(id, dados)
      } else {
        await audienciasService.criar(dados)
      }
      toast.sucesso('Audiência salva!')
      navigate('/audiencias')
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar Audiência' : 'Nova Audiência'} />
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
            <label>Tipo de Audiência</label>
            <select className="form-select" value={form.tipoAudienciaId} onChange={(e) => set('tipoAudienciaId', e.target.value)}>
              <option value="">Selecione</option>
              {tipos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {erros.tipoAudienciaId && <p className="form-erro">{erros.tipoAudienciaId}</p>}
          </div>
          <div className="form-campo">
            <label>Data e Hora</label>
            <input type="datetime-local" className="form-input" value={form.dataHora} onChange={(e) => set('dataHora', e.target.value)} />
            {erros.dataHora && <p className="form-erro">{erros.dataHora}</p>}
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Local</label>
              <input className="form-input" value={form.local} onChange={(e) => set('local', e.target.value)} />
            </div>
            <div className="form-campo">
              <label>Link Virtual</label>
              <input className="form-input" value={form.linkVirtual} onChange={(e) => set('linkVirtual', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="form-campo">
            <label>Observações</label>
            <textarea className="form-textarea" value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} rows={3} />
          </div>
          <div className="form-acoes">
            <button type="button" onClick={() => navigate(-1)} className="btn-secundario">Cancelar</button>
            <button type="submit" disabled={salvando} className="btn-primario">{salvando ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
