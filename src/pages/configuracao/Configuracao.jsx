import { useEffect, useState } from 'react'
import { configuracaoService } from '../../services/configuracao'
import LoadingSpinner from '../../components/LoadingSpinner'
import PageHeader from '../../components/PageHeader'
import { useToast } from '../../context/ToastContext'

export default function Configuracao() {
  const toast = useToast()
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({ nomeEscritorio: '', cnpj: '', telefone: '', email: '' })

  useEffect(() => {
    configuracaoService.obter()
      .then((data) => setForm({
        nomeEscritorio: data.nomeEscritorio ?? '',
        cnpj: data.cnpj ?? '',
        telefone: data.telefone ?? '',
        email: data.email ?? '',
      }))
      .catch((err) => toast.erro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setSalvando(true)
    try {
      await configuracaoService.salvar(form)
      toast.sucesso('Configurações salvas com sucesso!')
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Configuração do Escritório" />
      <div className="form-wrap">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-campo">
            <label>Nome do Escritório</label>
            <input className="form-input" value={form.nomeEscritorio} onChange={(e) => set('nomeEscritorio', e.target.value)} />
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>CNPJ</label>
              <input className="form-input" value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} />
            </div>
            <div className="form-campo">
              <label>Telefone</label>
              <input className="form-input" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} />
            </div>
          </div>
          <div className="form-campo">
            <label>E-mail</label>
            <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="form-acoes">
            <button type="submit" disabled={salvando} className="btn-primario">
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
