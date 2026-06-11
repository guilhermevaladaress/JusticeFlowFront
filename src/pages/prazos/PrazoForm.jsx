import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prazosService } from '../../services/prazos'
import { processosService } from '../../services/processos'
import { advogadosService } from '../../services/advogados'
import PageHeader from '../../components/PageHeader'
import { useToast } from '../../context/ToastContext'

export default function PrazoForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const [salvando, setSalvando] = useState(false)
  const [processos, setProcessos] = useState([])
  const [tipos, setTipos] = useState([])
  const [advogados, setAdvogados] = useState([])
  const [form, setForm] = useState({ processoId: '', tipoPrazoId: '', descricao: '', dataVencimento: '', observacoes: '', advogadoId: '' })
  const [erros, setErros] = useState({})

  useEffect(() => {
    Promise.all([processosService.listar(), prazosService.listarTipos(), advogadosService.listar()])
      .then(([p, t, a]) => { setProcessos(p); setTipos(t); setAdvogados(a) })
      .catch(() => {})
  }, [])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.processoId) e.processoId = 'Selecione o processo'
    if (!form.tipoPrazoId) e.tipoPrazoId = 'Selecione o tipo'
    if (!form.descricao) e.descricao = 'Obrigatório'
    if (!form.dataVencimento) e.dataVencimento = 'Obrigatório'
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      await prazosService.criar({
        ...form,
        processoId: Number(form.processoId),
        tipoPrazoId: Number(form.tipoPrazoId),
        advogadoId: form.advogadoId ? Number(form.advogadoId) : undefined,
      })
      toast.sucesso('Prazo criado!')
      navigate('/prazos')
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <PageHeader title="Novo Prazo" />
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
            <label>Tipo de Prazo</label>
            <select className="form-select" value={form.tipoPrazoId} onChange={(e) => set('tipoPrazoId', e.target.value)}>
              <option value="">Selecione</option>
              {tipos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {erros.tipoPrazoId && <p className="form-erro">{erros.tipoPrazoId}</p>}
          </div>
          <div className="form-campo">
            <label>Descrição</label>
            <input className="form-input" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} />
            {erros.descricao && <p className="form-erro">{erros.descricao}</p>}
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Data de Vencimento</label>
              <input type="date" className="form-input" value={form.dataVencimento} onChange={(e) => set('dataVencimento', e.target.value)} />
              {erros.dataVencimento && <p className="form-erro">{erros.dataVencimento}</p>}
            </div>
            <div className="form-campo">
              <label>Advogado Responsável</label>
              <select className="form-select" value={form.advogadoId} onChange={(e) => set('advogadoId', e.target.value)}>
                <option value="">Nenhum</option>
                {advogados.map((a) => <option key={a.id} value={a.id}>{a.nomeCompleto}</option>)}
              </select>
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
