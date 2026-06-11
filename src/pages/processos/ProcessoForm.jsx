import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { processosService } from '../../services/processos'
import { tribunaisService } from '../../services/tribunais'
import PageHeader from '../../components/PageHeader'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../context/ToastContext'

export default function ProcessoForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const toast = useToast()
  const [carregando, setCarregando] = useState(isEdit)
  const [salvando, setSalvando] = useState(false)
  const [tipos, setTipos] = useState([])
  const [tribunais, setTribunais] = useState([])
  const [varas, setVaras] = useState([])
  const [form, setForm] = useState({
    numeroProcesso: '',
    titulo: '',
    descricao: '',
    dataAbertura: '',
    tipoProcessoId: '',
    tribunalId: '',
    varaId: '',
  })
  const [erros, setErros] = useState({})

  useEffect(() => {
    Promise.all([
      processosService.listarTipos(),
      tribunaisService.listar(),
    ]).then(([t, tr]) => {
      setTipos(t)
      setTribunais(tr)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    processosService.detalhar(id)
      .then((p) => {
        setForm({
          numeroProcesso: p.numeroProcesso,
          titulo: p.titulo,
          descricao: p.descricao ?? '',
          dataAbertura: p.dataAbertura?.split('T')[0] ?? '',
          tipoProcessoId: p.tipoProcessoId,
          tribunalId: p.tribunalId,
          varaId: p.varaId ?? '',
        })
      })
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [id])

  useEffect(() => {
    if (!form.tribunalId) { setVaras([]); return }
    tribunaisService.listarVaras(Number(form.tribunalId))
      .then(setVaras)
      .catch(() => setVaras([]))
  }, [form.tribunalId])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.numeroProcesso) e.numeroProcesso = 'Obrigatório'
    if (!form.titulo) e.titulo = 'Obrigatório'
    if (!form.dataAbertura) e.dataAbertura = 'Obrigatório'
    if (!form.tipoProcessoId) e.tipoProcessoId = 'Selecione o tipo'
    if (!form.tribunalId) e.tribunalId = 'Selecione o tribunal'
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
        tipoProcessoId: Number(form.tipoProcessoId),
        tribunalId: Number(form.tribunalId),
        varaId: form.varaId ? Number(form.varaId) : undefined,
      }
      const resultado = isEdit
        ? await processosService.atualizar(id, dados)
        : await processosService.criar(dados)
      toast.sucesso('Processo salvo com sucesso!')
      navigate(`/processos/${resultado.id}`)
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar Processo' : 'Novo Processo'} />
      <div className="form-wrap">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-campo">
            <label>Número CNJ</label>
            <input className="form-input" value={form.numeroProcesso} onChange={(e) => set('numeroProcesso', e.target.value)} placeholder="0000000-00.0000.0.00.0000" />
            {erros.numeroProcesso && <p className="form-erro">{erros.numeroProcesso}</p>}
          </div>
          <div className="form-campo">
            <label>Título</label>
            <input className="form-input" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} />
            {erros.titulo && <p className="form-erro">{erros.titulo}</p>}
          </div>
          <div className="form-campo">
            <label>Descrição</label>
            <textarea className="form-textarea" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} rows={3} />
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Tipo de Processo</label>
              <select className="form-select" value={form.tipoProcessoId} onChange={(e) => set('tipoProcessoId', e.target.value)}>
                <option value="">Selecione</option>
                {tipos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
              {erros.tipoProcessoId && <p className="form-erro">{erros.tipoProcessoId}</p>}
            </div>
            <div className="form-campo">
              <label>Data de Abertura</label>
              <input type="date" className="form-input" value={form.dataAbertura} onChange={(e) => set('dataAbertura', e.target.value)} />
              {erros.dataAbertura && <p className="form-erro">{erros.dataAbertura}</p>}
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Tribunal</label>
              <select className="form-select" value={form.tribunalId} onChange={(e) => set('tribunalId', e.target.value)}>
                <option value="">Selecione</option>
                {tribunais.map((t) => <option key={t.id} value={t.id}>{t.sigla} — {t.nome}</option>)}
              </select>
              {erros.tribunalId && <p className="form-erro">{erros.tribunalId}</p>}
            </div>
            <div className="form-campo">
              <label>Vara (opcional)</label>
              <select className="form-select" value={form.varaId} onChange={(e) => set('varaId', e.target.value)}>
                <option value="">Nenhuma</option>
                {varas.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="form-acoes">
            <button type="button" onClick={() => navigate(-1)} className="btn-secundario">Cancelar</button>
            <button type="submit" disabled={salvando} className="btn-primario">
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
