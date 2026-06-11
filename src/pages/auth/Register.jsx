import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerService } from '../../services/auth'
import { useToast } from '../../context/ToastContext'

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    senha: '',
    telefone: '',
    role: 'Cliente',
    numeroOAB: '',
    uf: '',
    especialidade: '',
  })
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.nomeCompleto) e.nomeCompleto = 'Nome obrigatório'
    if (!form.email) e.email = 'E-mail obrigatório'
    if (form.senha.length < 6) e.senha = 'Mínimo 6 caracteres'
    if (form.role === 'Advogado') {
      if (!form.numeroOAB) e.numeroOAB = 'OAB obrigatório para Advogado'
      if (!form.uf) e.uf = 'UF obrigatória'
    }
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      await registerService(form)
      toast.sucesso('Cadastro realizado! Faça login.')
      navigate('/login')
    } catch (err) {
      toast.erro(err.message ?? 'Erro ao cadastrar.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="auth-tela">
      <div className="auth-card auth-card--md">
        <h1 style={{ textAlign: 'center', marginBottom: 24, fontSize: '1.4rem', fontWeight: 700 }}>Criar Conta</h1>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-campo">
            <label>Nome Completo</label>
            <input className="form-input" value={form.nomeCompleto} onChange={(e) => set('nomeCompleto', e.target.value)} />
            {erros.nomeCompleto && <p className="form-erro">{erros.nomeCompleto}</p>}
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>E-mail</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
              {erros.email && <p className="form-erro">{erros.email}</p>}
            </div>
            <div className="form-campo">
              <label>Senha</label>
              <input type="password" className="form-input" value={form.senha} onChange={(e) => set('senha', e.target.value)} />
              {erros.senha && <p className="form-erro">{erros.senha}</p>}
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>CPF</label>
              <input className="form-input" value={form.cpf} onChange={(e) => set('cpf', e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div className="form-campo">
              <label>Telefone</label>
              <input className="form-input" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} />
            </div>
          </div>
          <div className="form-campo">
            <label>Perfil</label>
            <select className="form-select" value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="Cliente">Cliente</option>
              <option value="Advogado">Advogado</option>
            </select>
          </div>
          {form.role === 'Advogado' && (
            <div className="form-grid-2">
              <div className="form-campo">
                <label>Número OAB</label>
                <input className="form-input" value={form.numeroOAB} onChange={(e) => set('numeroOAB', e.target.value)} />
                {erros.numeroOAB && <p className="form-erro">{erros.numeroOAB}</p>}
              </div>
              <div className="form-campo">
                <label>UF</label>
                <input className="form-input" maxLength={2} value={form.uf} onChange={(e) => set('uf', e.target.value)} placeholder="SP" />
                {erros.uf && <p className="form-erro">{erros.uf}</p>}
              </div>
              <div className="form-campo col-2">
                <label>Especialidade</label>
                <input className="form-input" value={form.especialidade} onChange={(e) => set('especialidade', e.target.value)} />
              </div>
            </div>
          )}
          <button type="submit" disabled={salvando} className="btn-primario" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {salvando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
