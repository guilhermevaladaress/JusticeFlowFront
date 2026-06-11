import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { entrar } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.email) e.email = 'E-mail obrigatório'
    if (!form.senha) e.senha = 'Senha obrigatória'
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      await entrar(form.email, form.senha)
      navigate('/dashboard')
    } catch (err) {
      toast.erro(err.message ?? 'Credenciais inválidas.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="auth-tela">
      <div className="auth-card auth-card--sm">
        <div className="auth-brand">
          <h1>JusticeFlow</h1>
          <p>Controle Processual Jurídico</p>
        </div>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-campo">
            <label>E-mail</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="seu@email.com"
            />
            {erros.email && <p className="form-erro">{erros.email}</p>}
          </div>
          <div className="form-campo">
            <label>Senha</label>
            <input
              type="password"
              className="form-input"
              value={form.senha}
              onChange={(e) => set('senha', e.target.value)}
              placeholder="••••••••"
            />
            {erros.senha && <p className="form-erro">{erros.senha}</p>}
          </div>
          <button type="submit" disabled={salvando} className="btn-primario" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {salvando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-footer">
          Não tem conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
