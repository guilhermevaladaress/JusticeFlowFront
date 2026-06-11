import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from '../../components/AuthLayout';
import type { User } from '../../types/auth';

export function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const login     = useAuthStore((s) => s.login);
  const destino   = (location.state as any)?.from?.pathname ?? '/dashboard';

  const [email,        setEmail]        = useState('');
  const [senha,        setSenha]        = useState('');
  const [erro,         setErro]         = useState('');
  const [carregando,   setCarregando]   = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const res = await authApi.login({ email, senha });
      const { token, nomeCompleto, email: em, role } = res.data;
      const user: User = { id: '', email: em, nomeCompleto, role };
      login(token, user);
      navigate(destino, { replace: true });
    } catch (err: any) {
      setErro(err.response?.data?.mensagem ?? 'Credenciais inválidas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={aoEnviar}>
        <div className="auth-form-header">
          <h1 className="auth-titulo">Bem-vindo de volta</h1>
          <p className="auth-sub">Entre com suas credenciais para acessar o sistema.</p>
        </div>

        {erro && (
          <div className="auth-erro" role="alert">
            {erro}
          </div>
        )}

        <label className="auth-campo">
          <span>E-mail</span>
          <div className="auth-input-wrap">
            <Mail size={15} className="auth-input-icone" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              maxLength={50}
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

        <button type="submit" className="auth-btn" disabled={carregando}>
          {carregando ? (
            'Entrando...'
          ) : (
            <>
              Entrar na conta
              <ArrowRight size={16} strokeWidth={1.75} className="auth-btn-icone" />
            </>
          )}
        </button>

        <Link to="/register" className="auth-link">
          Não tem conta? <span>Cadastre-se gratuitamente</span>
        </Link>
      </form>
    </AuthLayout>
  );
}
