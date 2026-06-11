import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, Eye, EyeOff, MapPin, Loader2 } from 'lucide-react';
import { authApi } from '../../api/auth';
import AuthLayout from '../../components/AuthLayout';

async function buscarViaCep(cep: string) {
  const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
  const data = await res.json();
  if (data.erro) throw new Error('CEP não encontrado.');
  return data;
}

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomeCompleto: '', email: '', senha: '',
    cpf: '', telefone: '', role: 'Cliente',
    numeroOAB: '', uf: '', especialidade: '',
    cep: '', logradouro: '', numero: '',
    complemento: '', bairro: '', cidade: '', estado: '',
  });
  const [erro,         setErro]         = useState('');
  const [carregando,   setCarregando]   = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [buscandoCep,  setBuscandoCep]  = useState(false);
  const [erroCep,      setErroCep]      = useState('');

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCep(valor: string) {
    setForm(f => ({ ...f, cep: valor }));
    const limpo = valor.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    setErroCep('');
    try {
      const data = await buscarViaCep(valor);
      setForm(f => ({
        ...f,
        logradouro: data.logradouro ?? '',
        bairro:     data.bairro     ?? '',
        cidade:     data.localidade ?? '',
        estado:     data.uf         ?? '',
      }));
    } catch (e: any) {
      setErroCep(e.message ?? 'Erro ao consultar CEP.');
    } finally {
      setBuscandoCep(false);
    }
  }

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await authApi.register(form as any);
      navigate('/login');
    } catch (err: any) {
      setErro(err.response?.data?.mensagem ?? 'Erro ao cadastrar. Verifique os dados.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={aoEnviar}>
        <div className="auth-form-header">
          <h1 className="auth-titulo">Criar sua conta</h1>
          <p className="auth-sub">Preencha os dados abaixo para começar a usar o JusticeFlow.</p>
        </div>

        {erro && <div className="auth-erro" role="alert">{erro}</div>}

        {/* ── Dados pessoais ── */}
        <label className="auth-campo">
          <span>Nome completo</span>
          <div className="auth-input-wrap">
            <User size={15} className="auth-input-icone" />
            <input
              name="nomeCompleto"
              value={form.nomeCompleto}
              onChange={handle}
              placeholder="Seu nome completo"
              autoComplete="name"
              maxLength={150}
              required
            />
          </div>
        </label>

        <label className="auth-campo">
          <span>E-mail</span>
          <div className="auth-input-wrap">
            <Mail size={15} className="auth-input-icone" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handle}
              placeholder="seu@email.com"
              autoComplete="email"
              maxLength={150}
              required
            />
          </div>
        </label>

        <label className="auth-campo">
          <span>Senha</span>
          <div className="auth-input-wrap">
            <Lock size={15} className="auth-input-icone" />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              name="senha"
              value={form.senha}
              onChange={handle}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              maxLength={50}
              autoComplete="new-password"
              style={{ paddingRight: '42px' }}
              required
            />
            <button
              type="button"
              className="auth-input-eye"
              onClick={() => setMostrarSenha((v) => !v)}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
            </button>
          </div>
        </label>

        {/* ── Endereço ── */}
        <div className="auth-secao-titulo">
          <MapPin size={13} strokeWidth={2} />
          Endereço <span>(opcional)</span>
        </div>

        <label className="auth-campo">
          <span>CEP</span>
          <div className="auth-input-wrap">
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                name="cep"
                value={form.cep}
                onChange={e => handleCep(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                style={{ width: '100%', padding: '12px 36px 12px 16px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, font: 'inherit', fontSize: 15, color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'border-color .18s, box-shadow .18s' }}
                onFocus={e => { e.target.style.borderColor = '#1B3A6B'; e.target.style.boxShadow = '0 0 0 3px rgba(27,58,107,.1)'; }}
                onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
              {buscandoCep && <Loader2 size={15} className="auth-cep-spinner" />}
            </div>
          </div>
          {erroCep && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{erroCep}</span>}
        </label>

        <div className="auth-endereco-grid">
          <label className="auth-campo">
            <span>Logradouro</span>
            <input name="logradouro" value={form.logradouro} onChange={handle} placeholder="Rua, Av., Travessa..." maxLength={200} className="auth-input-plain" />
          </label>
          <label className="auth-campo auth-campo--sm">
            <span>Número</span>
            <input name="numero" value={form.numero} onChange={handle} placeholder="123" maxLength={10} className="auth-input-plain" />
          </label>
        </div>

        <label className="auth-campo">
          <span>Complemento</span>
          <input name="complemento" value={form.complemento} onChange={handle} placeholder="Apto, sala, bloco..." maxLength={100} className="auth-input-plain" />
        </label>

        <div className="auth-endereco-grid">
          <label className="auth-campo">
            <span>Cidade</span>
            <input name="cidade" value={form.cidade} onChange={handle} placeholder="Cidade" maxLength={100} className="auth-input-plain" />
          </label>
          <label className="auth-campo auth-campo--sm">
            <span>Estado</span>
            <input name="estado" value={form.estado} onChange={handle} placeholder="UF" maxLength={2} className="auth-input-plain" style={{ textTransform: 'uppercase' }} />
          </label>
        </div>

        <button type="submit" className="auth-btn" disabled={carregando} style={{ marginTop: 8 }}>
          {carregando ? 'Cadastrando...' : (
            <>
              Criar conta
              <ArrowRight size={16} strokeWidth={1.75} className="auth-btn-icone" />
            </>
          )}
        </button>

        <Link to="/login" className="auth-link">
          Já tem conta? <span>Entrar</span>
        </Link>
      </form>
    </AuthLayout>
  );
}
