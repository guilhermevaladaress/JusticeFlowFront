import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { contratosService } from '../../services/contratos'
import { advogadosService } from '../../services/advogados'
import { clientesService } from '../../services/clientes'
import PageHeader from '../../components/PageHeader'
import { useToast } from '../../context/ToastContext'

export default function ContratoForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const [salvando, setSalvando] = useState(false)
  const [advogados, setAdvogados] = useState([])
  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState({
    advogadoId: '',
    clienteId: '',
    dataAssinatura: '',
    dataValidade: '',
    valorHonorarios: '',
    formaPagamento: 'Fixo',
  })
  const [erros, setErros] = useState({})

  useEffect(() => {
    Promise.all([advogadosService.listar(), clientesService.listar()])
      .then(([a, c]) => { setAdvogados(a); setClientes(c) })
      .catch(() => {})
  }, [])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.advogadoId) e.advogadoId = 'Selecione o advogado'
    if (!form.clienteId) e.clienteId = 'Selecione o cliente'
    if (!form.dataAssinatura) e.dataAssinatura = 'Obrigatório'
    if (form.valorHonorarios === '' || isNaN(Number(form.valorHonorarios))) e.valorHonorarios = 'Valor inválido'
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      await contratosService.criar({
        ...form,
        advogadoId: Number(form.advogadoId),
        clienteId: Number(form.clienteId),
        valorHonorarios: Number(form.valorHonorarios),
      })
      toast.sucesso('Contrato criado!')
      navigate('/contratos')
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <PageHeader title="Novo Contrato" />
      <div className="form-wrap">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Advogado</label>
              <select className="form-select" value={form.advogadoId} onChange={(e) => set('advogadoId', e.target.value)}>
                <option value="">Selecione</option>
                {advogados.map((a) => <option key={a.id} value={a.id}>{a.nomeCompleto}</option>)}
              </select>
              {erros.advogadoId && <p className="form-erro">{erros.advogadoId}</p>}
            </div>
            <div className="form-campo">
              <label>Cliente</label>
              <select className="form-select" value={form.clienteId} onChange={(e) => set('clienteId', e.target.value)}>
                <option value="">Selecione</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
              </select>
              {erros.clienteId && <p className="form-erro">{erros.clienteId}</p>}
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Data de Assinatura</label>
              <input type="date" className="form-input" value={form.dataAssinatura} onChange={(e) => set('dataAssinatura', e.target.value)} />
              {erros.dataAssinatura && <p className="form-erro">{erros.dataAssinatura}</p>}
            </div>
            <div className="form-campo">
              <label>Data de Validade</label>
              <input type="date" className="form-input" value={form.dataValidade} onChange={(e) => set('dataValidade', e.target.value)} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Valor (R$)</label>
              <input type="number" step="0.01" className="form-input" value={form.valorHonorarios} onChange={(e) => set('valorHonorarios', e.target.value)} />
              {erros.valorHonorarios && <p className="form-erro">{erros.valorHonorarios}</p>}
            </div>
            <div className="form-campo">
              <label>Forma de Pagamento</label>
              <select className="form-select" value={form.formaPagamento} onChange={(e) => set('formaPagamento', e.target.value)}>
                <option value="Fixo">Fixo</option>
                <option value="PercentualExito">% Êxito</option>
                <option value="Misto">Misto</option>
              </select>
            </div>
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
